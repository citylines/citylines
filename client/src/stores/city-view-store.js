import Store from './store';

import 'whatwg-fetch';

import Style from '../lib/style';
import LinesMapper from '../lib/lines-mapper';
import Timeline from '../lib/timeline';
import MouseEvents from '../lib/mouse-events';
import KmInfo from '../lib/km-info';

const CityViewStore = Object.assign({}, Store, {
  cityData: {},

  async fetchCityBaseData(urlName) {
    const url = `/api/${urlName}/view/base_data`;
    const response = await fetch(url);

    if (response.status == 404) return;

    const json = await response.json();
    return json;
  },

  async fetchCityYearsData(urlName) {
    const url = `/api/${urlName}/view/years_data`;
    const response = await fetch(url);

    if (response.status == 404) return;

    const json = await response.json();
    return json;
  },

  async fetchFeaturesPopupData(featureIds) {
    const url = `/api/popup/${featureIds.join(',')}`;
    const response = await fetch(url);

    if (response.status == 404) return;

    const json = await response.json();
    return json.featuresData;
  },

  async loadKmInfo(urlName, year, lines) {
    const yearsData = await this.fetchCityYearsData(urlName);

    this.cityData[urlName].kmInfo = new KmInfo(yearsData);
    this.cityData[urlName].kmInfo.update({year: year, lines: lines});

    this.emitChangeEvent();
  },

  async load(urlName, queryParams) {
    let cityData = await this.fetchCityBaseData(urlName);

    if (!cityData) return;

    cityData = this.updateWithQuery(cityData, queryParams);

    const style = new Style(cityData.lines);

    const linesShown = cityData.linesShown || cityData.lines.map((line) => line.url_name);
    cityData.linesMapper = new LinesMapper({style: style, linesShown: linesShown, urlName: urlName});
    cityData.timeline = new Timeline(cityData.linesMapper, cityData.years);
    cityData.mouseEvents = new MouseEvents(cityData.linesMapper);

    const startingYear = cityData.years.default || cityData.years.start;
    cityData.timeline.toYear(startingYear);

    if (cityData.speed) {
      cityData.timeline.setSpeed(cityData.speed);
    }

    this.cityData[urlName] = cityData;

    this.loadKmInfo(urlName, startingYear, linesShown);

    this.emitChangeEvent();
  },

  unload(urlName) {
    delete this.cityData[urlName];
    this.emitChangeEvent();
  },

  updateWithQuery(cityData, queryParams) {
    if (queryParams.year) cityData.years.default = parseInt(queryParams.year);
    if (queryParams.lines) cityData.linesShown = queryParams.lines.split(',');
    if (queryParams.speed) cityData.speed = queryParams.speed;

    // FIXME: deprecate system_id ?
    if (queryParams.system_id || queryParams.systems) {
      const systems = (queryParams.system_id || queryParams.systems).split(',').map(s => parseInt(s));
      const systemLines =  cityData.lines.filter((line) => systems.includes(line.system_id));
      cityData.linesShown = systemLines.map(l => l.url_name);
    }

    return cityData;
  },

  getState(urlName) {
    const cityData = this.cityData[urlName] || {};

    return {
      lines: cityData.lines,
      systems: cityData.systems,
      transportModes: cityData.transport_modes,
      showTransportModes: cityData.showTransportModes || false,
      showStationLabels: cityData.linesMapper ? cityData.linesMapper.showStationLabels : true,
      sources: cityData.linesMapper ? cityData.linesMapper.sources : [],
      linesShown: cityData.linesMapper ? cityData.linesMapper.linesShown.slice() : [],
      years: cityData.years,
      currentYear: cityData.timeline ? cityData.timeline.years.current : null,
      playing: cityData.timeline ? cityData.timeline.playing : false,
      speed: cityData.timeline ? cityData.timeline.speed : null,
      clickedFeatures: cityData.clickedFeatures,
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

  setSpeed(urlName, speed) {
    const cityData = this.cityData[urlName];
    cityData.timeline.setSpeed(speed);

    this.emitChangeEvent();
  },

  toggleLine(urlName, lineUrlName) {
    const cityData = this.cityData[urlName];
    cityData.linesMapper.toggleLine(lineUrlName);
    cityData.kmInfo.update({lines: cityData.linesMapper.linesShown});

    this.emitChangeEvent();
  },

  toggleAllLines(urlName, systemId, checked) {
    const cityData = this.cityData[urlName];

    const systemLines = cityData.lines.filter((line) => line.system_id == systemId).map(line => line.url_name);

    cityData.linesMapper.linesShown = cityData.linesMapper.linesShown.filter(line => !systemLines.includes(line));

    if (checked) {
      cityData.linesMapper.linesShown = cityData.linesMapper.linesShown.concat(systemLines);
    }

    cityData.linesMapper.updateLayers();
    cityData.kmInfo.update({lines: cityData.linesMapper.linesShown});

    this.emitChangeEvent();
  },

  toggleStationLabels() {
    const cityData = this.cityData[urlName];
    cityData.linesMapper.toggleStationLabels();
    this.emitChangeEvent();
  },

  showAllSystems(urlName) {
    const cityData = this.cityData[urlName];
    cityData.linesMapper.linesShown = cityData.lines.map((line) => line.url_name);

    cityData.linesMapper.updateLayers();
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

  async clickFeatures(urlName, point, features) {
    if (features.length == 0) return;

    const cityData = this.cityData[urlName];
    if (!cityData || !cityData.mouseEvents) return;

    const featuresIds = features.map(f => {
      const props = f.properties;
      const k = props.klass;
      const id = props.id.split('-')[0];
      props._key = [k, id].join('-');
      return props._key;
    });

    const featuresData = await this.fetchFeaturesPopupData(featuresIds);

    const updatedFeatures = features.map((el,idx) => (
      {properties: { ...el.properties, ...featuresData[el.properties._key]}}
    ));

    cityData.clickedFeatures = {
      point: point,
      features: updatedFeatures
    }

    this.emitChangeEvent();
  },

  unClickFeatures(urlName) {
    const cityData = this.cityData[urlName];

    //This method may be called when we are unmounting the city
    //and there are open popups. In these cases, cityData may be already
    //deleted (via the #unload method), so we check if it exists.
    if (!cityData) return;

    cityData.clickedFeatures = null;
    this.emitChangeEvent();
  },

  setKmYear(urlName, year) {
    const cityData = this.cityData[urlName];
    if (!cityData.kmInfo) return;
    cityData.kmInfo.update({year: year});
    this.emitChangeEvent();
  },

  setShowTransportModes(urlName, value) {
    const cityData = this.cityData[urlName];
    cityData.showTransportModes = value;
    this.emitChangeEvent();
  }
});

export default CityViewStore
