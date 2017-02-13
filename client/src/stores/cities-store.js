import Store from './store';
import 'whatwg-fetch';

const CitiesStore = Object.assign({}, Store, {
  cities: [],
  value: '',

  async fetchCities() {
    const url = '/api/cities';
    const response = await fetch(url);
    const json = await response.json();
    this.cities = json.cities;
    this.emitChangeEvent();
  },

  setValue(value) {
    this.value = value;
    this.emitChangeEvent();
  },

  getState() {
    return {
      value: this.value,
      cities: this.cities
    }
  }
});

export default CitiesStore
