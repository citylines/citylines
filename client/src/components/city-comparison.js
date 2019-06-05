import React, {PureComponent} from 'react';
import {browserHistory} from 'react-router';

import {Map, Source, Layer, Popup, Draw} from './map';
import Tags from './tags';

import Translate from 'react-translate-component';
import FeaturePopupContent from './city/feature-popup-content';
import CityComparisonHeader from './city-comparison/header';
import Intro from './city-comparison/intro';
import CityComparisonSettings from './city-comparison/settings';

import CitiesStore from '../stores/cities-store';
import CityStore from '../stores/city-store';
import CityViewStore from '../stores/city-view-store';

class CityComparison extends PureComponent {
  constructor(props, context) {
    super(props, context);

    const urlNames = this.params().cities ? this.params().cities.split(",") : [];

    this.state = {
      urlNames: urlNames,
      cities: {},
      citiesList: [],
      systemsShown: {},
      showSettings: false
    }

    this.bindedOnChange = this.onChange.bind(this);
  }

  params() {
    return this.props.location.query;
  }

  updateParams(newParams) {
    const params = {...this.params(), ...newParams};

    // We delete null params
    Object.keys(params).forEach((key) => (params[key] == null || params[key].toString() == "NaN") && delete params[key]);

    // If new params are equal to the current ones, we don't push the state to the
    // browser history
    if (JSON.stringify(params) === JSON.stringify(this.params())) return;

    browserHistory.push({...this.props.location, query: params});
  }

  componentWillMount() {
    CityStore.addChangeListener(this.bindedOnChange);
    CityViewStore.addChangeListener(this.bindedOnChange);
    CitiesStore.addChangeListener(this.bindedOnChange);
  }

  componentWillUnmount() {
    this.activeUrlNames().map(urlName => {
      CityViewStore.unload(urlName);
    });
    CityStore.removeChangeListener(this.bindedOnChange);
    CityViewStore.removeChangeListener(this.bindedOnChange);
    CitiesStore.removeChangeListener(this.bindedOnChange);
  }

  componentDidMount() {
    this.activeUrlNames().map(urlName => {
      this.loadCity(urlName);
    });
    CitiesStore.fetchCities();
  }

  onChange() {
    let newState = {
      urlNames: this.state.urlNames,
      cities: {},
      citiesList: CitiesStore.getState().cities
    };

    this.activeUrlNames().map(urlName => {
      newState.cities[urlName] = CityStore.getState(urlName);
      newState.cities[urlName].systems = CityViewStore.getState(urlName).systems;

      // systems visibility
      if (!this.state.systemsShown[urlName] && newState.cities[urlName].systems) {
        this.state.systemsShown[urlName] = newState.cities[urlName].systems.map(s => s.id);
      }
      newState.cities[urlName].systemsShown = this.state.systemsShown[urlName] || [];
    }
    );

    if (this.activeUrlNames()[0]) {
      const firstCityState = CityViewStore.getState(this.activeUrlNames()[0]);
      newState.year = firstCityState.currentYear;
      newState.min = (firstCityState.years || {}).start;
      newState.max = (firstCityState.years || {}).end;
      newState.playing = firstCityState.playing;
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

    this.updateParams({cities: urlNames.join(",")});

    this.setState({urlNames: [...urlNames], systemsShown: updatedSystemsShown}, () => {
      urlNames.map((newUrlName, index) => {
        const oldUrlName = oldUrlNames[index];
        if (newUrlName != oldUrlName) {
          CityViewStore.unload(oldUrlName);
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

    this.setState({systemsShown: systemsShown}, () =>
      CityViewStore.toggleAllLines(urlName, systemId, show)
    );
  }

  activeUrlNames() {
    return this.state.urlNames.filter(urlName => !!urlName);
  }

  loadCity(urlName) {
    if (!urlName) return;
    CityStore.load(urlName, this.params());
    CityViewStore.load(urlName, this.params());
  }

  title() {
    let cities = this.activeUrlNames().map(urlName => {
      const city = this.state.cities[urlName];
      if (city) return city.name;
      }
    );

    cities = cities.filter(city => !!city);

    if (cities.length  > 1) {
      return cities.join(" vs ");
    } else if (cities.length > 0) {
      return cities[0];
    } else {
      return;
    }
  }

  render() {
    return (
      <main className="o-grid__cell o-grid__cell--width-100 o-panel-container">
         { this.title() && <Tags
           title="compare.title"
            interpolations={{cities: this.title()}}
          /> }
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
          urlNames={this.state.urlNames}
          cities={this.state.cities}
          onSystemToggle={this.handleSystemToggle.bind(this)}
        />
      }
      {
        !this.activeUrlNames().length && <Intro />
      }
      {
        this.state.urlNames.map((urlName, mapIndex) => {
          const state = this.state.cities[urlName];
          if (!state) return null;

          return <Map
            key={`map-${mapIndex}`}
            mapIndex={mapIndex}
            mapboxAccessToken={state.mapbox_access_token}
            mapboxStyle={state.mapbox_style}
            center={state.coords}
            zoom={state.zoom}
            bearing={state.bearing}
            pitch={state.pitch}
            mouseEventsLayerNames={state.mouseEventsLayerNames}
            onMouseMove={(point, features) => {CityViewStore.hover(urlName, features)}}
            onMouseClick={(point, features) => {CityViewStore.clickFeatures(urlName, point, features)}}
            onMove={this.handleMapMove.bind(this)}
            disableMouseEvents={state.playing} >
            { state.sources && state.sources.map((source) => { return (
                <Source
                  key={source.name}
                  name={source.name}
                  data={source.data}
                />
              )
            }) }
            { state.layers && state.layers.map((layer) => { return (
                <Layer
                  key={layer.id}
                  id={layer.id}
                  source={layer.source}
                  type={layer.type}
                  paint={layer.paint}
                  filter={layer.filter}
                />
              )
            }) }
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
