import Store from './store';
import MainStore from './main-store';
import CityStore from './city-store';

import 'whatwg-fetch';

const EditorStore = Object.assign({}, Store, {
  cityData: {},

  async fetchCityData(urlName) {
    const url = `/api/editor/${urlName}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  },

  async load(urlName, queryParams) {
    if (!this.cityData[urlName]) {
      const cityData = await this.fetchCityData(urlName);

      const existingCityData = CityStore.cityData[urlName];

      if (existingCityData) {
        this.cityData[urlName] = this.updateWithExistingCityData(cityData, Object.assign({}, existingCityData));
      } else {
        this.cityData[urlName] = this.updateWithQuery(cityData, queryParams);
      }
    }

    this.emitChangeEvent();
  },

  updateWithExistingCityData(cityData, existingCityData) {
    cityData.config.coords = existingCityData.config.coords;
    cityData.config.zoom = existingCityData.config.zoom;
    cityData.config.bearing = existingCityData.config.bearing;
    cityData.config.pitch = existingCityData.config.pitch;
    return cityData;
  },

  updateWithQuery(cityData, queryParams) {
    if (queryParams.geo) {
      const parts = queryParams.geo.split(',');
      cityData.config.coords = [parseFloat(parts[1]), parseFloat(parts[0])];
      cityData.config.zoom = parseFloat(parts[2]);
      cityData.config.bearing = parseFloat(parts[3]);
      cityData.config.pitch = parseFloat(parts[4]);
    }
    return cityData;
  },

  getState(urlName) {
    const cityData = this.cityData[urlName] || {};

    return {
      main: MainStore.getState(),
      name: cityData.name,
      features: cityData.features,
      lines: cityData.lines,
      config: cityData.config || {},
      selectedFeature: cityData.selectedFeature,
      modifiedFeatures: cityData.modifiedFeatures,
      selectedFeatureById: cityData.selectedFeatureById
    }
  },

  async fetchFeatures(urlName) {
    const url = `/api/editor/${urlName}/features`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  },

  async update(urlName, body) {
    const url = `/api/editor/${urlName}/update`;
    const response = await fetch(url, {method:'PUT', body: body});
    const json = await response.json();
    return json;
  },

  storeGeoData(urlName, geo) {
    const cityData = this.cityData[urlName];
    cityData.config.coords = [geo.lon, geo.lat];
    cityData.config.zoom = geo.zoom;
    cityData.config.bearing = geo.bearing;
    cityData.config.pitch = geo.pitch;
  },

  getFeatureByKlassAndId(urlName, klass, id){
    const cityData = this.cityData[urlName];
    return cityData.features.features.find((f) => {
      return (f.properties.klass == klass && f.properties.id == id)
    });
  },

  changeSelection(urlName, features) {
    const cityData = this.cityData[urlName];
    cityData.selectedFeature = features[0];

    // Most of the times, the feature will be already selected,
    // but for cases where the selection is triggered by the Modified Features
    // Panel, we set manually the feature to be selected in Draw
    cityData.selectedFeatureById = features[0] ? features[0].id : null;

    this.emitChangeEvent();
  },

  updateFeature(urlName, feature) {
    const klass = feature.properties.klass;
    const id = feature.properties.id;

    const cityData = this.cityData[urlName];
    const index = cityData.features.features.findIndex((f) => {
      return (f.properties.klass == klass && f.properties.id == id)
    });

    cityData.features.features[index] = Object.assign({}, feature);
    cityData.features = Object.assign({}, cityData.features);
  },

  pushFeature(urlName, feature) {
    const cityData = this.cityData[urlName];
    cityData.features.features.push(feature);
    cityData.features = Object.assign({}, cityData.features);
  },

  removeFeature(urlName, feature) {
    const klass = feature.properties.klass;
    const id = feature.properties.id;

    const cityData = this.cityData[urlName];
    const index = cityData.features.features.findIndex((f) => {
      return (f.properties.klass == klass && f.properties.id == id)
    });

    cityData.features.features.splice(index, 1);
    cityData.features = Object.assign({}, cityData.features);
  },

  setModifiedFeature(urlName, feature) {
    const cityData = this.cityData[urlName];
    cityData.modifiedFeatures = Object.assign({}, cityData.modifiedFeatures || {});

    const klass = feature.properties.klass;
    const id = feature.properties.id;
    const key = feature.id;

    if (!cityData.modifiedFeatures[key]) {
      cityData.modifiedFeatures[key] = {klass: klass, id: id};
    }

    const modifiedFeature = cityData.modifiedFeatures[key];
    modifiedFeature.feature = Object.assign({}, feature);

    return modifiedFeature;
  },

  setFeaturePropsChange(urlName, feature) {
    this.updateFeature(urlName, feature);
    const modifiedFeature = this.setModifiedFeature(urlName, feature);
    modifiedFeature.props = true;

    const cityData = this.cityData[urlName];
    cityData.selectedFeature = Object.assign({}, feature);

    this.emitChangeEvent();
  },

  setFeatureGeoChange(urlName, features) {
    features.map((feature) => {
      this.updateFeature(urlName, feature);
      const modifiedFeature = this.setModifiedFeature(urlName, feature);
      modifiedFeature.geo = true;
    });

    this.emitChangeEvent();
  },

  setFeatureCreated(urlName, features) {
    features.map((feature) => {
      this.pushFeature(urlName, feature);
      const modifiedFeature = this.setModifiedFeature(urlName, feature);
      modifiedFeature.created = true;
    });

    this.emitChangeEvent();
  },

  setFeatureDeleted(urlName, features) {
    features.map((feature) => {
      this.removeFeature(urlName, feature);
      const modifiedFeature = this.setModifiedFeature(urlName, feature);
      if (modifiedFeature.created) {
        const cityData = this.cityData[urlName];
        delete cityData.modifiedFeatures[feature.id];
        cityData.selectedFeature = null;
      } else {
        modifiedFeature.removed = true;
      }
    });

    this.emitChangeEvent();
  },

  setSelectedFeature(urlName, klass, id) {
    const feature = this.getFeatureByKlassAndId(urlName, klass, id);
    EditorStore.changeSelection(urlName, [feature]);
  },

  async discardChanges(urlName) {
    const features = await this.fetchFeatures(urlName);

    const cityData = this.cityData[urlName];

    cityData.features = Object.assign({}, features);
    delete cityData.modifiedFeatures;
    delete cityData.selectedFeature;

    this.emitChangeEvent();
  },

  async saveChanges(urlName) {
    const cityData = this.cityData[urlName];

    const changes = Object.entries(cityData.modifiedFeatures).map((entry) => {
      return entry[1];
    });

    const updatedFeatures = await this.update(urlName, JSON.stringify(changes));

    cityData.features = Object.assign({}, updatedFeatures);
    delete cityData.modifiedFeatures;
    delete cityData.selectedFeature;

    this.emitChangeEvent();
  }
});

export default EditorStore
