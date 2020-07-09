import Store from './store';
import 'whatwg-fetch';

const CitiesStore = Object.assign({}, Store, {
  searchResults: [],
  searchTerm: '',
  searchPage: 1,
  thereAreMoreResults: true,
  topContributors: [],
  monthTopContributors: [],
  topSystems: [],

  async fetchResults() {
    let url = `/api/cities/list?page=${this.searchPage}`;

    if (this.searchTerm) {
      url += `&term=${this.searchTerm}`;
    }

    const response = await fetch(url);
    const json = await response.json();

    if (this.searchPage == 1) {
      this.searchResults = [];
    }

    this.thereAreMoreResults = json.cities.length === 5;
    this.searchResults = [...this.searchResults, ...json.cities];
    this.emitChangeEvent();
  },

  fetchMoreResults() {
    this.searchPage++;
    this.fetchResults();
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
      searchResults: this.searchResults,
      topContributors: this.topContributors,
      monthTopContributors: this.monthTopContributors,
      topSystems: this.topSystems,
      thereAreMoreResults: this.thereAreMoreResults
    }
  }
});

export default CitiesStore
