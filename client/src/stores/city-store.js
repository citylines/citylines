import Store from './store';
import 'whatwg-fetch';

const CityStore = Object.assign({}, Store, {
  defaultConfig: {},

  async fetchDefaultConfig(urlName) {
    const url = `/api/${urlName}/config`;
    const response = await fetch(url);
    const json = await response.json();
    this.defaultConfig[urlName] = json;
  },

  async loadConfig(urlName) {
    if (!this.defaultConfig[urlName]) {
      await this.fetchDefaultConfig(urlName);
    }
    this.emitChangeEvent();
  },

  params() {
    // TODO: Read params from browser
    return {};
  },

  config(urlName) {
    const config = this.defaultConfig[urlName] || {};
    return Object.assign(config, this.params());
  },

  getState(urlName) {
    return {
      config: this.config(urlName)
    }
  }
});

export default CityStore
