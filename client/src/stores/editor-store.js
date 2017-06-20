import Store from './store';

import 'whatwg-fetch';
import {v1 as uuid } from 'uuid';

const EditorStore = Object.assign({}, Store, {
  cityData: {},

/* --Requests-- */

  async fetchCityData(urlName) {
    const url = `/api/editor/${urlName}/data`;
    const response = await fetch(url, {credentials: 'same-origin'});
    const json = await response.json();
    return json;
  },

  async fetchFeatures(urlName) {
    const url = `/api/editor/${urlName}/features`;
    const response = await fetch(url, {credentials: 'same-origin'});
    const json = await response.json();
    return json;
  },

  async updateFeatures(urlName, body) {
    const url = `/api/editor/${urlName}/features`;
    const response = await fetch(url, {method:'PUT', body: body, credentials: 'same-origin'});
    const json = await response.json();
    return json;
  },

  async updateLine(urlName, args) {
    const url = `/api/editor/${urlName}/line`;
    const body = JSON.stringify(args);
    const response = await fetch(url, {method: 'PUT', body: body, credentials: 'same-origin'});
    const json = await response.json();

    const cityData = this.cityData[urlName];
    cityData.lines = json;

    this.emitChangeEvent();
  },

  async createLine(urlName, args) {
    const url = `/api/editor/${urlName}/line`;
    const body = JSON.stringify(args);
    const response = await fetch(url, {method: 'POST', body: body, credentials: 'same-origin'});
    const json = await response.json();

    const cityData = this.cityData[urlName];
    cityData.lines = json;

    this.emitChangeEvent();
  },

  async deleteLine(urlName, lineUrlName) {
    const url = `/api/editor/${urlName}/line`;
    const body = JSON.stringify({line_url_name: lineUrlName});
    const response = await fetch(url, {method: 'DELETE', body: body, credentials: 'same-origin'});
    const json = await response.json();

    const cityData = this.cityData[urlName];
    cityData.lines = json;

    this.emitChangeEvent();
  },

  async updateSystem(urlName, args) {
    const url = `/api/editor/${urlName}/system`;
    const body = JSON.stringify(args);
    const response = await fetch(url, {method: 'PUT', body: body, credentials: 'same-origin'});
    const json = await response.json();

    const cityData = this.cityData[urlName];
    cityData.systems = json;

    this.emitChangeEvent();
  },

  async createSystem(urlName, systemName) {
    const url = `/api/editor/${urlName}/system`;
    const body = JSON.stringify({name: systemName});
    const response = await fetch(url, {method: 'POST', body: body, credentials: 'same-origin'});
    const json = await response.json();

    const cityData = this.cityData[urlName];
    cityData.systems = json;

    this.emitChangeEvent();
  },

  async deleteSystem(urlName, systemId) {
    const url = `/api/editor/${urlName}/system`;
    const body = JSON.stringify({id: systemId});
    const response = await fetch(url, {method: 'DELETE', body: body, credentials: 'same-origin'});
    const json = await response.json();

    const cityData = this.cityData[urlName];
    cityData.systems = json;

    this.emitChangeEvent();
  },

  async fetchFeaturesFromOSM(urlName, route, bounds) {
    const params = `route=${route}&s=${bounds.s}&n=${bounds.n}&w=${bounds.w}&e=${bounds.e}`;
    const url = `/api/editor/${urlName}/osm?${params}`;
    const response = await fetch(url, {credentials: 'same-origin'});
    const json = await response.json();
    return json;
  },
/* ------------ */

  async load(urlName) {
    this.cityData[urlName] = await this.fetchCityData(urlName);

    this.emitChangeEvent();
  },

  unload(urlName) {
    delete this.cityData[urlName];
  },

  getState(urlName) {
    const cityData = this.cityData[urlName] || {};

    return {
      features: cityData.features,
      lines: cityData.lines,
      systems: cityData.systems,
      selectedFeature: cityData.selectedFeature,
      modifiedFeatures: cityData.modifiedFeatures,
      selectedFeatureById: cityData.selectedFeatureById,
      savingData: cityData.savingData
    }
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

  updateFeatureInFeatureCollection(urlName, feature) {
    const klass = feature.properties.klass;
    const id = feature.properties.id;

    const cityData = this.cityData[urlName];
    const index = cityData.features.features.findIndex((f) => {
      return (f.properties.klass == klass && f.properties.id == id)
    });

    cityData.features.features[index] = Object.assign({}, feature);
    cityData.features = Object.assign({}, cityData.features);
  },

  pushFeatureToFeatureCollection(urlName, feature) {
    const cityData = this.cityData[urlName];
    cityData.features.features.push(feature);
    cityData.features = Object.assign({}, cityData.features);
  },

  removeFeatureFromFeatureCollection(urlName, feature) {
    const klass = feature.properties.klass;
    const id = feature.properties.id;

    const cityData = this.cityData[urlName];
    const index = cityData.features.features.findIndex((f) => {
      return (f.properties.klass == klass && f.properties.id == id)
    });

    cityData.features.features.splice(index, 1);

    // FIXME: The following line is commented because:
    // 1. It's not that necessary (the Draw element already has the element removed, even though it's state is outdated)
    // 2. It triggers an "undefined is not an object (evaluating 'e.toGeoJSON')" error.
    // But eventually it has to be uncommented so Draw has an up-to-date state
    //
    // cityData.features = Object.assign({}, cityData.features);
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
    this.updateFeatureInFeatureCollection(urlName, feature);
    const modifiedFeature = this.setModifiedFeature(urlName, feature);
    modifiedFeature.props = true;

    const cityData = this.cityData[urlName];
    cityData.selectedFeature = Object.assign({}, feature);

    this.emitChangeEvent();
  },

  setFeatureGeoChange(urlName, features) {
    features.map((feature) => {
      this.updateFeatureInFeatureCollection(urlName, feature);
      const modifiedFeature = this.setModifiedFeature(urlName, feature);
      modifiedFeature.geo = true;
    });

    this.emitChangeEvent();
  },

  setFeatureCreated(urlName, features) {
    const cityData = this.cityData[urlName];

    features.map((feature) => {
      const klass = feature.geometry.type === 'Point' ? 'Station' : 'Section';
      feature.properties.id = uuid();
      feature.properties.klass = klass;
      feature.properties.opening = 0;
      feature.properties.buildstart = 0;
      feature.properties.closure = 999999;
      feature.properties.line_url_name = cityData.lines[0] ? cityData.lines[0].url_name : null;
      if (klass == 'Station' && !feature.properties.name) feature.properties.name = '';

      this.pushFeatureToFeatureCollection(urlName, feature);
      const modifiedFeature = this.setModifiedFeature(urlName, feature);
      modifiedFeature.created = true;
    });

    this.emitChangeEvent();
  },

  setFeatureDeleted(urlName, features) {
    features.map((feature) => {
      this.removeFeatureFromFeatureCollection(urlName, feature);
      const modifiedFeature = this.setModifiedFeature(urlName, feature);
      if (modifiedFeature.created) {
        delete this.cityData[urlName].modifiedFeatures[feature.id];
      } else {
        modifiedFeature.removed = true;
      }
    });

    this.cityData[urlName].selectedFeature = null;
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

    cityData.savingData = true;
    this.emitChangeEvent();

    const changes = Object.entries(cityData.modifiedFeatures).map((entry) => {
      return entry[1];
    });

    const updatedFeatures = await this.updateFeatures(urlName, JSON.stringify(changes));

    cityData.features = Object.assign({}, updatedFeatures);
    delete cityData.modifiedFeatures;
    delete cityData.selectedFeature;

    cityData.savingData = false;
    this.emitChangeEvent();
  },

  async importFromOSM(urlName, route, bounds) {
    const cityData = this.cityData[urlName];
    cityData.savingData = true;
    this.emitChangeEvent();

    const data = await this.fetchFeaturesFromOSM(urlName, route, bounds);

    cityData.savingData = false;

    this.setFeatureCreated(urlName, data.features.map(f => {
      f.id = `osm_${f.properties.osm_id}`;
      return f;
    }));
  }
});

export default EditorStore
