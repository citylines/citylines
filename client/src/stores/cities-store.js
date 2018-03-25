import Store from './store';
import 'whatwg-fetch';

const CitiesStore = Object.assign({}, Store, {
  cities: [],
  value: '',
  topContributors: [],
  monthTopContributors: [],
  topSystems: [],

  async fetchCities() {
    const url = '/api/cities/list';
    const response = await fetch(url);
    const json = await response.json();
    this.cities = json.cities;
    this.emitChangeEvent();
  },

  async fetchContributors() {
    const url = '/api/cities/top_contributors';
    const response = await fetch(url);
    const json = await response.json();
    this.topContributors = json.top_contributors;
    this.monthTopContributors = json.month_top_contributors;
    this.emitChangeEvent();
  },

  async fetchTopSystems() {
    const url = '/api/cities/top_systems';
    const response = await fetch(url);
    const json = await response.json();
    this.topSystems = json.top_systems;
    this.emitChangeEvent();
  },

  setValue(value) {
    this.value = value;
    this.emitChangeEvent();
  },

  getState() {
    return {
      value: this.value,
      cities: this.cities,
      topContributors: this.topContributors,
      monthTopContributors: this.monthTopContributors,
      topSystems: this.topSystems
    }
  }
});

export default CitiesStore
