import Store from './store';
import MainStore from './main-store';

import 'whatwg-fetch';

import Style from '../lib/style';
import LinesMapper from '../lib/lines-mapper';
import Timeline from '../lib/timeline';
import MouseEvents from '../lib/mouse-events';
import KmInfo from '../lib/km-info';

const CityStore = Object.assign({}, Store, {
  cityData: {},

  async fetchCityData(urlName) {
    const url = `/api/${urlName}`;
    const response = await fetch(url);
    const json = await response.json();
    return json;
  },

  async load(urlName, queryParams) {
    const previousCityData = this.cityData[urlName] ? Object.assign({}, this.cityData[urlName]) : null;

    const cityData = await this.fetchCityData(urlName);

    if (previousCityData) {
      this.cityData[urlName] = this.updateWithPreviousCityData(cityData, previousCityData);
    } else {
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
    cityData.kmInfo = new KmInfo(cityData.lines_length_by_year);

    const startingYear = cityData.config.years.default || cityData.config.years.start;
    cityData.timeline.toYear(startingYear);
    cityData.kmInfo.update({year: startingYear, lines: linesShown});

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

  updateWithPreviousCityData(cityData, previousCityData) {
    cityData.linesShown = previousCityData.linesMapper.linesShown.slice();
    cityData.config.years.default = previousCityData.timeline.years.current;
    cityData.config.coords = previousCityData.config.coords;
    cityData.config.zoom = previousCityData.config.zoom;
    cityData.config.bearing = previousCityData.config.bearing;
    cityData.config.pitch = previousCityData.config.pitch;

    return cityData;
  },

  getState(urlName) {
    const cityData = this.cityData[urlName] || {};

    return {
      main: MainStore.getState(),
      name: cityData.name,
      lines: cityData.lines,
      config: cityData.config || {},
      linesShown: cityData.linesMapper ? cityData.linesMapper.linesShown : [],
      sources: cityData.linesMapper ? cityData.linesMapper.sources : [],
      layers: cityData.linesMapper ? cityData.linesMapper.layers : [],
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
    cityData.kmInfo.update({lines: cityData.linesMapper.linesShown});
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
  },

  storeGeoData(urlName, geo) {
    const cityData = this.cityData[urlName];
    cityData.config.coords = [geo.lon, geo.lat];
    cityData.config.zoom = geo.zoom;
    cityData.config.bearing = geo.bearing;
    cityData.config.pitch = geo.pitch;
  }
});

export default CityStore
