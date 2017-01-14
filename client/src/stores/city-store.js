import Store from './store';
import 'whatwg-fetch';

const CityStore = Object.assign({}, Store, {
  cityData: {},

  async fetchCityData(urlName) {
    const url = `/api/${urlName}`;
    const response = await fetch(url);
    const json = await response.json();
    this.cityData[urlName] = json;
  },

  async load(urlName) {
    if (!this.cityData[urlName]) {
      await this.fetchCityData(urlName);
    }
    this.emitChangeEvent();
  },

  params() {
    // TODO: Read params from browser
    return {};
  },

  updatedConfig(config) {
    return {config: Object.assign(config, this.params())};
  },

  getState(urlName) {
    const cityData = this.cityData[urlName] || {config: {}};
    return Object.assign({}, cityData, this.updatedConfig(cityData.config));
  }
});

export default CityStore
