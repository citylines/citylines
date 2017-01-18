import Store from './store';
import 'whatwg-fetch';

import Style from '../lib/style';
import LinesMapper from '../lib/lines-mapper';
import Timeline from '../lib/timeline';
import MouseEvents from '../lib/mouse-events';

const CityStore = Object.assign({}, Store, {
  cityData: {},

  async fetchCityData(urlName) {
    const url = `/api/${urlName}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  },

  async load(urlName, queryParams) {
    if (!this.cityData[urlName]) {
      const cityData = await this.fetchCityData(urlName);
      this.cityData[urlName] = this.updateWithQuery(cityData, queryParams);
    }
    this.emitChangeEvent();
  },

  loadStore(urlName) {
    const cityData = this.cityData[urlName];

    const style = new Style(cityData.style);

    const linesShown = cityData.linesShown || cityData.lines.map((line) => line.url_name);
    cityData.linesMapper = new LinesMapper({style: style, linesShown: linesShown, urlName: urlName});
    cityData.timeline = new Timeline(cityData.linesMapper, cityData.config.years);
    cityData.mouseEvents = new MouseEvents(style, {lines: cityData.linesMapper});

    cityData.timeline.toYear(cityData.config.years.default || cityData.config.years.start);

    this.emitChangeEvent();
  },

  updateWithQuery(cityData, queryParams) {
    if (queryParams.year) cityData.config.years.default = parseInt(queryParams.year);
    if (queryParams.lines) cityData.linesShown = queryParams.lines.split(',');
    if (queryParams.geo) {
      const parts = queryParams.geo.split(',');
      cityData.config.coords = [parseFloat(parts[1]), parseFloat(parts[0])];
      cityData.config.zoom = parseFloat(parts[2]);
      cityData.config.bearing = parseFloat(parts[3]);
      cityData.config.pitch = parseFloat(parts[4]);
    }
    return cityData;
  },

  getState(urlName) {
    const cityData = this.cityData[urlName] || {};

    // Here I use a #map so we create a new Object, instead of passing a reference to the same
    // `linesShown` object
    const linesShown = (cityData.linesMapper ? cityData.linesMapper.linesShown : []).map((l) => {return l});

    return {
      name: cityData.name,
      lines: cityData.lines,
      config: cityData.config || {},
      linesShown: linesShown,
      sources: cityData.linesMapper ? cityData.linesMapper.sources() : [],
      layers: cityData.linesMapper ? cityData.linesMapper.getLayers() : [],
      currentYear: cityData.timeline ? cityData.timeline.years.current : null,
      playing: cityData.timeline ? cityData.timeline.playing : false
    };
  },

  toggleAnimation(urlName) {
    const cityData = this.cityData[urlName];

    if (cityData.timeline.playing) {
      cityData.timeline.stopAnimation();
      return;
    }

    cityData.timeline.animateToYear(cityData.config.years.end,
        () => {
          this.emitChangeEvent();
        },
        () => {
          this.emitChangeEvent();
        },
        () => {
          this.emitChangeEvent();
        });
  },

  setYear(urlName, year) {
    const cityData = this.cityData[urlName];
    cityData.timeline.toYear(year);
    this.emitChangeEvent();
  },

  toggleLine(urlName, lineUrlName) {
    const cityData = this.cityData[urlName];
    cityData.linesMapper.toggleLine(lineUrlName);
    this.emitChangeEvent();
  },

  hover(urlName, features) {
    const cityData = this.cityData[urlName];
    cityData.mouseEvents.hover(features, () => {
      this.emitChangeEvent();
    });
  }
});

export default CityStore
