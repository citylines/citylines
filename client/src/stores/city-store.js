import Store from './store';
import MainStore from './main-store';
import CityViewStore from './city-view-store';
import EditorStore from './editor-store';

import 'whatwg-fetch';

const CityStore = Object.assign({}, Store, {
  cityData: {},

  async fetchCityData(urlName) {
    const url = `/api/${urlName}/config`;
    const response = await fetch(url);

    if (response.status == 404) {
      return {error: 'Missing city'}
    }

    const json = await response.json();
    return json;
  },

  async load(urlName, queryParams) {
    if (!this.cityData[urlName]) {
      const cityData = await this.fetchCityData(urlName);
      this.cityData[urlName] = this.updateWithQuery(cityData, queryParams);
    }
    this.emitChangeEvent();
  },

  unload(urlName) {
    delete this.cityData[urlName];
    this.emitChangeEvent();
  },

  updateWithQuery(cityData, queryParams) {
    if (queryParams.geo) {
      const parts = queryParams.geo.split(',');
      cityData.coords = [parseFloat(parts[1]), parseFloat(parts[0])];
      cityData.zoom = parseFloat(parts[2]);
      cityData.bearing = parseFloat(parts[3]);
      cityData.pitch = parseFloat(parts[4]);
    }
    // This is the case of the city-comparison
    if (queryParams.zoom) {
      cityData.zoom = queryParams.zoom;
    }

    if (queryParams.map) {
      cityData.map = queryParams.map;
    }

    return cityData;
  },

  getState(urlName) {
    const cityViewState = CityViewStore.getState(urlName);
    const editorState = EditorStore.getState(urlName);

    return {
      ...(this.cityData[urlName] || {}),
      main: MainStore.getState(),
      sources: cityViewState.sources,
      layers: cityViewState.layers,
      playing: cityViewState.playing,
      mouseEventsLayerNames: cityViewState.mouseEventsLayerNames,
      clickedFeatures: cityViewState.clickedFeatures,
      drawFeatures: editorState.features,
      drawSelectedFeatureById: editorState.selectedFeatureById,
      drawCurrentMode: editorState.currentMode
    };
  },

  setGeoData(urlName, geo) {
    const cityData = this.cityData[urlName];
    cityData.coords = [geo.lon, geo.lat];
    cityData.bounds = geo.bounds;
    cityData.zoom = geo.zoom;
    cityData.bearing = geo.bearing;
    cityData.pitch = geo.pitch;

    this.emitChangeEvent()
  },

  setZoom(urlName, zoom) {
    const cityData = this.cityData[urlName];
    cityData.zoom = zoom;
    this.emitChangeEvent();
  }
});

export default CityStore
