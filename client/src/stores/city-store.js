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

  async load(urlName) {
    if (!this.cityData[urlName]) {
      const cityData = await this.fetchCityData(urlName);
      this.cityData[urlName] = Object.assign(cityData, this.params());
    }
    this.emitChangeEvent();
  },

  setMap(urlName, map) {
    const cityData = this.cityData[urlName];

    const style = new Style(cityData.style);

    const linesShown = cityData.linesShow || cityData.lines.map((line) => line.url_name);
    cityData.linesMapper = new LinesMapper({map: map, style: style, linesShown: linesShown});
    cityData.timeline = new Timeline(cityData.linesMapper, cityData.config.years);

    cityData.timeline.toYear(cityData.config.years.default || cityData.config.years.start);

    this.emitChangeEvent();
  },

  params() {
    // TODO: Read params from browser
    return {};
  },

  getState(urlName) {
    const cityData = this.cityData[urlName] || {};

    return {
      name: cityData.name,
      lines: cityData.lines,
      config: cityData.config || {},
      linesShown: cityData.linesMapper ? cityData.linesMapper.linesShown : [],
      currentYear: cityData.timeline ? cityData.timeline.years.current : null
    };
  }
});

export default CityStore
