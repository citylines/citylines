import Store from './store';

import 'whatwg-fetch';

import Style from '../lib/style';
import LinesMapper from '../lib/lines-mapper';
import Timeline from '../lib/timeline';
import MouseEvents from '../lib/mouse-events';
import KmInfo from '../lib/km-info';

const CityViewStore = Object.assign({}, Store, {
  cityData: {},
  stateCache: {},

  async fetchCityData(urlName) {
    const url = `/api/${urlName}/view_data`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  },

  async load(urlName, queryParams) {
    let cityData = await this.fetchCityData(urlName);

    if (this.stateCache[urlName]) {
      cityData = this.updateWithStateCache(cityData, Object.assign({}, this.stateCache[urlName]));
    } else {
      cityData = this.updateWithQuery(cityData, queryParams);
    }

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

    this.emitChangeEvent();
  },

  unload(urlName) {
    const cityData = Object.assign({}, this.cityData[urlName]);

    this.stateCache[urlName] = {
      currentYear: cityData.timeline.years.current,
      linesShown: cityData.linesMapper.linesShown,
    }

    delete this.cityData[urlName];
    this.emitChangeEvent();
  },

  updateWithQuery(cityData, queryParams) {
    if (queryParams.year) cityData.years.default = parseInt(queryParams.year);
    if (queryParams.lines) cityData.linesShown = queryParams.lines.split(',');

    return cityData;
  },

  updateWithStateCache(cityData, stateCache) {
    cityData.years.default = stateCache.currentYear;
    cityData.linesShown = stateCache.linesShown;

    return cityData;
  },

  getState(urlName) {
    const cityData = this.cityData[urlName] || {};

    return {
      lines: cityData.lines,
      sources: cityData.linesMapper ? cityData.linesMapper.sources : [],
      layers: cityData.linesMapper ? cityData.linesMapper.layers : [],
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
    cityData.kmInfo.update({lines: cityData.linesMapper.linesShown});

    this.emitChangeEvent();
  },

  hover(urlName, features) {
    const cityData = this.cityData[urlName];
    if (!cityData || !cityData.mouseEvents) return;

    cityData.mouseEvents.hover(features, () => {
      this.emitChangeEvent();
    });
  },

  clickFeatures(urlName, point, features) {
    const cityData = this.cityData[urlName];
    if (!cityData || !cityData.mouseEvents) return;

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
