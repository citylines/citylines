import Store from './store';
import 'whatwg-fetch';

import Style from '../lib/style';
import LinesMapper from '../lib/lines-mapper';
import Timeline from '../lib/timeline';

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

  setMap(urlName, map) {
    const cityData = this.cityData[urlName];

    const style = new Style(cityData.style);

    const linesShown = cityData.linesShown || cityData.lines.map((line) => line.url_name);
    cityData.linesMapper = new LinesMapper({map: map, style: style, linesShown: linesShown});
    cityData.timeline = new Timeline(cityData.linesMapper, cityData.config.years);

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

    return {
      name: cityData.name,
      lines: cityData.lines,
      config: cityData.config || {},
      linesShown: cityData.linesMapper ? cityData.linesMapper.linesShown : [],
      currentYear: cityData.timeline ? cityData.timeline.years.current : null,
      playing: cityData.timeline ? cityData.timeline.playing : false
    };
  },

  toggleAnimation(urlName, yearCallback) {
    const cityData = this.cityData[urlName];

    if (cityData.timeline.playing) {
      cityData.timeline.stopAnimation();
      this.emitChangeEvent();
      return;
    }

    cityData.timeline.animateToYear(cityData.config.years.end,
        () => {
          this.emitChangeEvent();
        },
        yearCallback,
        () => {
          this.emitChangeEvent();
        });
  },

  setYear(urlName, year) {
    const cityData = this.cityData[urlName];
    cityData.timeline.toYear(year);
    this.emitChangeEvent();
  }
});

export default CityStore
