import Store from './store';
import 'whatwg-fetch';

const CitiesStore = Object.assign({}, Store, {
  cities: [],

  async fetchCities() {
    const url = '/api/cities';
    const response = await fetch(url);
    const json = await response.json();
    this.cities = json.cities;
    this.emitChangeEvent();
  },

  getState() {
    return {
      cities: this.cities
    }
  }
});

export default CitiesStore
