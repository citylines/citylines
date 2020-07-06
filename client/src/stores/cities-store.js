import Store from './store';
import 'whatwg-fetch';

const CitiesStore = Object.assign({}, Store, {
  cities: [],
  searchTerm: '',
  searchPage: 1,
  topContributors: [],
  monthTopContributors: [],
  topSystems: [],

  async fetchCities() {
    let url = `/api/cities/list?page=${this.searchPage}`;

    if (this.searchTerm) {
      url += `&term=${this.searchTerm}`;
    }

    const response = await fetch(url);
    const json = await response.json();

    if (this.searchPage == 1) {
      this.cities = []
    }

    this.cities = [...this.cities, ...json.cities];
    this.emitChangeEvent();
  },

  fetchMoreCities() {
    this.searchPage++;
    this.fetchCities();
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

  setSearchTerm(value) {
    this.searchPage = 1;
    this.searchTerm = value;
    this.emitChangeEvent();
  },

  getState() {
    return {
      searchTerm: this.searchTerm,
      cities: this.cities,
      topContributors: this.topContributors,
      monthTopContributors: this.monthTopContributors,
      topSystems: this.topSystems
    }
  }
});

export default CitiesStore
