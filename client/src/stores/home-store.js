import Store from './store';
import 'whatwg-fetch';

const HomeStore = Object.assign({}, Store, {
  searchResults: [],
  searchTerm: '',
  visibleSearchTerm: '',
  searchPage: 1,
  thereAreMoreResults: true,
  searching: true,
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

    this.visibleSearchTerm = this.searchTerm;
    this.thereAreMoreResults = json.cities.length === 5;
    this.searchResults = [...this.searchResults, ...json.cities];
    this.searching = false;
    this.emitChangeEvent();
  },

  fetchMoreResults() {
    this.searching = true;
    this.emitChangeEvent();
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
    this.visibleSearchTerm = value;
    const searchTerm = value.trim();

    if (searchTerm != this.searchTerm &&
      (!searchTerm || searchTerm.length > 2)) {
      this.searchTerm = searchTerm;
      this.resetSearchTimeout();
    }

    this.emitChangeEvent();
  },

  cancelSearchTimeout() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  },

  resetSearchTimeout() {
    this.cancelSearchTimeout();
    this.searchTimeout = setTimeout(() => {
      this.fetchResults();
    }, 750);
  },

  getState() {
    return {
      searchTerm: this.searchTerm,
      visibleSearchTerm: this.visibleSearchTerm,
      searchResults: this.searchResults,
      searching: this.searching,
      topContributors: this.topContributors,
      monthTopContributors: this.monthTopContributors,
      topSystems: this.topSystems,
      thereAreMoreResults: this.thereAreMoreResults
    }
  }
});

export default HomeStore
