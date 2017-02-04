import Store from './store';
import MainStore from './main-store';
import CityViewStore from './city-view-store';

import 'whatwg-fetch';

const CityStore = Object.assign({}, Store, {
  cityData: {},

  async fetchCityData(urlName) {
    const url = `/api/${urlName}/config`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  },

  async load(urlName, queryParams) {
    const cityData = await this.fetchCityData(urlName);

    this.cityData[urlName] = this.updateWithQuery(cityData, queryParams);

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
    return cityData;
  },

  getState(urlName) {
    const cityViewState = CityViewStore.getState(urlName);

    return {
      ...(this.cityData[urlName] || {}),
      main: MainStore.getState(),
      sources: cityViewState.sources,
      layers: cityViewState.layers
    };
  },

  setSourcesAndLayers(urlName, sources, layers) {
    const cityData = this.cityData[urlName];
    cityData.sources = sources;
    cityData.layers = layers;

    this.emitChangeEvent();
  },

  unsetSourcesAndLayers(urlName, sources, layers) {
    const cityData = this.cityData[urlName];
    delete cityData.sources;
    delete cityData.layers;

    this.emitChangeEvent();
  },
});

export default CityStore
