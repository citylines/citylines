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
      config: cityData.config || {},
      selectedFeature: cityData.selectedFeature,
      modifiedFeatures: cityData.modifiedFeatures
    }
  },

  storeGeoData(urlName, geo) {
    const cityData = this.cityData[urlName];
    cityData.config.coords = [geo.lon, geo.lat];
    cityData.config.zoom = geo.zoom;
    cityData.config.bearing = geo.bearing;
    cityData.config.pitch = geo.pitch;
  },

  changeSelection(urlName, features) {
    const cityData = this.cityData[urlName];
    cityData.selectedFeature = features[0];
    this.emitChangeEvent();
  },

  setFeaturePropsChange(urlName, feature) {
    const cityData = this.cityData[urlName];
    cityData.modifiedFeatures = Object.assign({}, cityData.modifiedFeatures || {});
    cityData.modifiedFeatures[feature.id] = cityData.modifiedFeatures[feature.id] || {};
    cityData.modifiedFeatures[feature.id].klass = feature.properties.klass;
    cityData.modifiedFeatures[feature.id].id = feature.properties.id;
    cityData.modifiedFeatures[feature.id].props = true;

    this.emitChangeEvent();
  }
});

export default EditorStore
