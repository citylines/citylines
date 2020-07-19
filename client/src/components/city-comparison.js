import React from 'react';
import CityBase from './city-base';

import {Map, Source, Popup, Draw} from './map';
import Tags from './tags';

import Translate from 'react-translate-component';
import FeaturePopupContent from './city/feature-popup-content';
import CityComparisonHeader from './city-comparison/header';
import Intro from './city-comparison/intro';
import CityComparisonSettings from './city-comparison/settings';

import CitiesStore from '../stores/cities-store';
import CityStore from '../stores/city-store';
import CityViewStore from '../stores/city-view-store';

class CityComparison extends CityBase {
  constructor(props, context) {
    super(props, context);

    const urlNames = this.params().cities ? this.params().cities.split(",") : [];
    const systemsShown = {};

    if (this.params().systems) {
      const systems = this.params().systems.split('|');
      systemsShown[urlNames[0]] = systems[0].split(',').map(s => parseInt(s));
      systemsShown[urlNames[1]] = systems[1].split(',').map(s => parseInt(s));
    }

    this.state = {
      urlNames: urlNames,
      cities: {},
      citiesList: [],
      systems: {},
      systemsShown: systemsShown,
      showSettings: false
    };

    this.bindedOnChange = this.onChange.bind(this);
  }

  componentWillUnmount() {
    this.activeUrlNames().map(urlName => {
      CityViewStore.unload(urlName);
      CityStore.unload(urlName);
    });
    CityStore.removeChangeListener(this.bindedOnChange);
    CityViewStore.removeChangeListener(this.bindedOnChange);
    CitiesStore.removeChangeListener(this.bindedOnChange);
  }

  componentDidMount() {
    CityStore.addChangeListener(this.bindedOnChange);
    CityViewStore.addChangeListener(this.bindedOnChange);
    CitiesStore.addChangeListener(this.bindedOnChange);

    this.activeUrlNames().map(urlName => {
      this.loadCity(urlName);
    });
    CitiesStore.fetchCitiesWithContributors();
  }

  onChange() {
    let newState = {
      urlNames: this.state.urlNames,
      cities: {},
      citiesList: CitiesStore.getState().cities,
      systems: {},
      systemsShown: {...this.state.systemsShown}
    };

    this.activeUrlNames().map(urlName => {
      newState.cities[urlName] = CityStore.getState(urlName);

      // systems visibility
      // ===================
      newState.systems[urlName] = CityViewStore.getState(urlName).systems;

      if (!newState.systemsShown[urlName] && newState.systems[urlName]) {
        newState.systemsShown[urlName] = newState.systems[urlName].map(s => s.id);
        this.updateParams({systems: this.buildSystemsParam(newState.systemsShown)});
      }
      // ===================
    }
    );

    if (this.activeUrlNames()[0]) {
      const firstCityState = CityViewStore.getState(this.activeUrlNames()[0]);
      newState.year = firstCityState.currentYear;
      newState.min = (firstCityState.years || {}).start;
      newState.max = (firstCityState.years || {}).end;
      newState.playing = firstCityState.playing;
      newState.speed = firstCityState.speed;
    }

    this.setState(newState);
  }

  handleMapMove(map) {
    if (this.state.playing) return;

    const zoom = map.getZoom().toFixed(2);

    this.updateParams({zoom: zoom});

    this.activeUrlNames().map(urlName =>
      CityStore.setZoom(urlName, zoom)
    );
  }

  handleCitiesChange(urlNames) {
    const oldUrlNames = [...this.state.urlNames];

    // Remove outdated systemsShown data
    const updatedSystemsShown = {...this.state.systemsShown};
    Object.keys(updatedSystemsShown).map(key => {
      if (!urlNames.includes(key)) delete updatedSystemsShown[key];
    });

    this.updateParams({
      cities: urlNames.join(","),
      systems: this.buildSystemsParam(updatedSystemsShown, urlNames)
    });

    this.setState({urlNames: [...urlNames], systemsShown: updatedSystemsShown}, () => {
      urlNames.map((newUrlName, index) => {
        const oldUrlName = oldUrlNames[index];
        if (newUrlName != oldUrlName) {
          CityViewStore.unload(oldUrlName);
          CityStore.unload(oldUrlName);
          this.loadCity(newUrlName);
        }
      });
    });
  }

  handleYearChange(year) {
    this.activeUrlNames().map(urlName =>
      CityViewStore.setYear(urlName, year)
    );
  }

  handleYearUpdate() {
    if (this.state.playing) return;
    this.updateParams({year: this.state.year});
  }

  handleToggleAnimation() {
    this.activeUrlNames().map(urlName =>
      CityViewStore.toggleAnimation(urlName)
    );
  }

  handleToggleSettings() {
    this.setState({showSettings: !this.state.showSettings});
  }

  handleSystemToggle(urlName, systemId, show) {
    let systemsShown = {...this.state.systemsShown};
    if (show) {
      systemsShown[urlName].push(systemId);
    } else {
      systemsShown[urlName] = systemsShown[urlName].filter(id => id != systemId);
    }

    this.updateParams({systems: this.buildSystemsParam(systemsShown)});

    this.setState({systemsShown: systemsShown}, () =>
      CityViewStore.toggleAllLines(urlName, systemId, show)
    );
  }

  handleSpeedChange(speed) {
    this.updateParams({speed: speed});

    this.activeUrlNames().map(urlName =>
      CityViewStore.setSpeed(urlName, speed)
    );
  }

  buildSystemsParam(systemsShown, urlNames = null) {
    urlNames = urlNames || this.state.urlNames;
    return urlNames.map(urlName => (systemsShown[urlName] || []).join(',')).join('|');
  }

  activeUrlNames() {
    return this.state.urlNames.filter(urlName => !!urlName);
  }

  loadCity(urlName) {
    if (!urlName) return;

    const params = {...this.params()};

    if (params.systems) {
      const cityIndex = this.state.urlNames.indexOf(urlName);
      const systems = params.systems.split('|')[cityIndex];
      delete params.systems;
      if (systems) {
        params.systems = systems;
      }
    }

    CityStore.load(urlName, params);
    CityViewStore.load(urlName, params);
  }

  title() {
    let cities = this.activeUrlNames().map(urlName => {
      const city = this.state.cities[urlName];
      if (city) return city.name;
      }
    );

    cities = cities.filter(city => !!city);

    if (this.activeUrlNames().length > cities.length) {
      // This means that the cities are not loaded yet,
      // so we don't update thte title.
      return;
    }

    let titleContent = null;
    if (cities.length  > 1) {
      titleContent = cities.join(" vs ");
    } else if (cities.length > 0) {
      titleContent = cities[0];
    }

    if (titleContent) {
      return <Tags
        title="compare.title"
        interpolations={{cities: titleContent}}
        />
    } else {
      return <Tags title="compare.short_title" />
    }
  }

  render() {
    return (
      <main className="o-grid__cell o-grid__cell--width-100 o-panel-container">
      { this.title() }
      <CityComparisonHeader
        urlNames={this.state.urlNames}
        onChange={this.handleCitiesChange.bind(this)}
        year={this.state.year}
        onYearChange={this.handleYearChange.bind(this)}
        onYearUpdate={this.handleYearUpdate.bind(this)}
        toggleAnimation={this.handleToggleAnimation.bind(this)}
        toggleSettings={this.handleToggleSettings.bind(this)}
        playing={this.state.playing}
        showSettings={this.state.showSettings}
        citiesList={this.state.citiesList}
      />
      {
        this.state.showSettings && <CityComparisonSettings
          cities={this.state.cities}
          urlNames={this.state.urlNames}
          speed={this.state.speed}
          systems={this.state.systems}
          systemsShown={this.state.systemsShown}
          onSpeedChange={this.handleSpeedChange.bind(this)}
          onSystemToggle={this.handleSystemToggle.bind(this)}
        />
      }
      {
        !this.activeUrlNames().length && <Intro />
      }
      {
        [0,1].map((mapIndex) => {
          const urlName = this.state.urlNames[mapIndex];
          const state = this.state.cities[urlName] || {};

          return <Map
            key={`map-${mapIndex}`}
            mapIndex={mapIndex}
            mapboxAccessToken={state.mapbox_access_token}
            mapboxStyle={state.mapbox_style}
            mapStyle={state.map}
            center={state.coords}
            zoom={state.zoom}
            bearing={state.bearing}
            pitch={state.pitch}
            mouseEventsLayerNames={state.mouseEventsLayerNames}
            onMouseMove={(point, features) => {CityViewStore.hover(urlName, features)}}
            onMouseClick={(point, features) => {CityViewStore.clickFeatures(urlName, point, features)}}
            onMove={this.handleMapMove.bind(this)}
            disableMouseEvents={state.playing} >
            { state.sources && state.sources.map((source) =>
              <Source
                key={source.name}
                name={source.name}
                data={source.data}
                layers={source.layers}
              />
            ) }
            { state.clickedFeatures && (<Popup
              point={state.clickedFeatures.point}
              onClose={() => {CityViewStore.unClickFeatures(urlName)}}>
              <div>
              {
                state.clickedFeatures.features.map((f,i) =>
                    <FeaturePopupContent
                      key={`${f.properties.klass}-${f.properties.id}-${f.properties.line_url_name}`}
                      feature={f}
                      index={i} />)
              }
              </div>
              </Popup>) }
          </Map>;
        })
      }
      </main>
    );
  }
}

export default CityComparison
