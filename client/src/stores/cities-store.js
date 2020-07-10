import Store from './store';
import 'whatwg-fetch';

const CitiesStore = Object.assign({}, Store, {
  cities: [],

  async fetchCitiesWithContributors() {
    let url = `/api/cities/list_with_contributors`;

    const response = await fetch(url);
    const json = await response.json();

    this.citiesWithContributors = json.cities;

    this.emitChangeEvent();
  },

  getState() {
    return {
      cities: this.citiesWithContributors
    }
  }
});


export default CitiesStore
