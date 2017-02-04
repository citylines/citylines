import Store from './store';
import CityStore from './city-store';

import 'whatwg-fetch';

import Style from '../lib/style';
import LinesMapper from '../lib/lines-mapper';
import Timeline from '../lib/timeline';
import MouseEvents from '../lib/mouse-events';
import KmInfo from '../lib/km-info';

const CityViewStore = Object.assign({}, Store, {
  cityData: {},

  async fetchCityData(urlName) {
    const url = `/api/${urlName}/view_data`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  },

  async load(urlName, queryParams) {
    let cityData = await this.fetchCityData(urlName);
    cityData = this.updateWithQuery(cityData, queryParams);

    const style = new Style(cityData.style);

    const linesShown = cityData.linesShown || cityData.lines.map((line) => line.url_name);
    cityData.linesMapper = new LinesMapper({style: style, linesShown: linesShown, urlName: urlName});
    cityData.timeline = new Timeline(cityData.linesMapper, cityData.years);
    cityData.mouseEvents = new MouseEvents(style, {lines: cityData.linesMapper});
    cityData.kmInfo = new KmInfo(cityData.lines_length_by_year);

    const startingYear = cityData.years.default || cityData.years.start;
    cityData.timeline.toYear(startingYear);
    cityData.kmInfo.update({year: startingYear, lines: linesShown});

    this.cityData[urlName] = cityData;

    CityStore.setSourcesAndLayers(urlName, cityData.linesMapper.sources, cityData.linesMapper.layers);

    this.emitChangeEvent();
  },

  unload(urlName) {
    CityStore.unsetSourcesAndLayers();
  },

  updateWithQuery(cityData, queryParams) {
    if (queryParams.year) cityData.years.default = parseInt(queryParams.year);
    if (queryParams.lines) cityData.linesShown = queryParams.lines.split(',');

    return cityData;
  },

  getState(urlName) {
    const cityData = this.cityData[urlName] || {};

    return {
      name: cityData.name,
      lines: cityData.lines,
      linesShown: cityData.linesMapper ? cityData.linesMapper.linesShown : [],
      years: cityData.years,
      currentYear: cityData.timeline ? cityData.timeline.years.current : null,
      playing: cityData.timeline ? cityData.timeline.playing : false,
      clickedFeatures: cityData.mouseEvents ? cityData.mouseEvents.clickedFeatures : null,
      mouseEventsLayerNames: cityData.mouseEvents ? cityData.mouseEvents.layerNames : [],
      kmOperative: cityData.kmInfo ? cityData.kmInfo.kmOperative : null,
      kmUnderConstruction: cityData.kmInfo ? cityData.kmInfo.kmUnderConstruction : null
    };
  },

  toggleAnimation(urlName) {
    const cityData = this.cityData[urlName];

    if (cityData.timeline.playing) {
      cityData.timeline.stopAnimation();
      return;
    }

    cityData.timeline.animateToYear(cityData.years.end,
        () => {
          CityStore.setSourcesAndLayers(urlName, cityData.linesMapper.sources, cityData.linesMapper.layers);
          this.emitChangeEvent();
        },
        () => {
          CityStore.setSourcesAndLayers(urlName, cityData.linesMapper.sources, cityData.linesMapper.layers);
          this.emitChangeEvent();
        },
        () => {
          CityStore.setSourcesAndLayers(urlName, cityData.linesMapper.sources, cityData.linesMapper.layers);
          this.emitChangeEvent();
        });
  },

  setYear(urlName, year) {
    const cityData = this.cityData[urlName];
    cityData.timeline.toYear(year);

    CityStore.setSourcesAndLayers(urlName, cityData.linesMapper.sources, cityData.linesMapper.layers);
    this.emitChangeEvent();
  },

  toggleLine(urlName, lineUrlName) {
    const cityData = this.cityData[urlName];
    cityData.linesMapper.toggleLine(lineUrlName);
    cityData.kmInfo.update({lines: cityData.linesMapper.linesShown});

    CityStore.setSourcesAndLayers(urlName, cityData.linesMapper.sources, cityData.linesMapper.layers);
    this.emitChangeEvent();
  },

  hover(urlName, features) {
    const cityData = this.cityData[urlName];
    if (!cityData.mouseEvents) return;

    cityData.mouseEvents.hover(features, () => {
      this.emitChangeEvent();
    });
  },

  clickFeatures(urlName, point, features) {
    const cityData = this.cityData[urlName];
    cityData.mouseEvents.clickFeatures(point, features, () => {
      this.emitChangeEvent();
    });
  },

  unClickFeatures(urlName) {
    const cityData = this.cityData[urlName];
    cityData.mouseEvents.unClickFeatures();
    this.emitChangeEvent();
  },

  setKmYear(urlName, year) {
    const cityData = this.cityData[urlName];
    if (!cityData.kmInfo) return;
    cityData.kmInfo.update({year: year});
    this.emitChangeEvent();
  }
});

export default CityViewStore
