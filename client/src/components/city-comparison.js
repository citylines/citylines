import React, {PureComponent} from 'react';
import {browserHistory} from 'react-router';

import {Map, Source, Layer, Popup, Draw} from './map';

import Translate from 'react-translate-component';
import FeaturePopupContent from './city/feature-popup-content';
import CityComparisonHeader from './city-comparison/header';

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
      citiesList: []
    }

    this.bindedOnChange = this.onChange.bind(this);
  }

  params() {
    return this.props.location.query;
  }

  updateParams(newParams) {
    const params = {...this.params(), ...newParams};

    // We delete null params
    Object.keys(params).forEach((key) => (params[key] == null) && delete params[key]);

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
    this.state.urlNames.map(urlName => {
      CityViewStore.unload(urlName);
    });
    CityStore.removeChangeListener(this.bindedOnChange);
    CityViewStore.removeChangeListener(this.bindedOnChange);
    CitiesStore.removeChangeListener(this.bindedOnChange);
  }

  componentDidMount() {
    this.state.urlNames.map(urlName => {
      CityStore.load(urlName, this.params());
      CityViewStore.load(urlName, this.params());
    });
    CitiesStore.fetchCities();
  }

  onChange() {
    let newState = {
      urlNames: this.state.urlNames,
      cities: {},
      citiesList: CitiesStore.getState().cities
    };

    this.state.urlNames.map(urlName =>
      newState.cities[urlName] = CityStore.getState(urlName)
    );

    if (this.state.urlNames[0]) {
      const firstCityState = CityViewStore.getState(this.state.urlNames[0]);
      newState.year = firstCityState.currentYear;
      newState.min = (firstCityState.years || {}).start;
      newState.max = (firstCityState.years || {}).end;
      newState.playing = firstCityState.playing;
    }

    this.setState(newState);
  }

  handleCitiesChange(urlNames) {
    const oldUrlNames = [...this.state.urlNames];

    this.updateParams({cities: urlNames.join(",")});

    this.setState({urlNames: [...urlNames]}, () => {
      urlNames.map((newUrlName, index) => {
        const oldUrlName = oldUrlNames[index];
        if (newUrlName != oldUrlName) {
          CityViewStore.unload(oldUrlName);
          CityStore.load(newUrlName, this.params());
          CityViewStore.load(newUrlName, this.params());
        }
      });
    });
  }

  handleYearChange(year) {
    this.state.urlNames.map(urlName =>
      CityViewStore.setYear(urlName, year)
    );
  }

  handleYearUpdate() {
    if (this.state.playing) return;
    this.updateParams({year: this.state.year});
  }

  handleToggleAnimation() {
    this.state.urlNames.map(urlName =>
      CityViewStore.toggleAnimation(urlName)
    );
  }

  render() {
    return (
      <main className="o-grid__cell o-grid__cell--width-100 o-panel-container">
      <CityComparisonHeader
        urlNames={this.state.urlNames}
        onChange={this.handleCitiesChange.bind(this)}
        year={this.state.year}
        onYearChange={this.handleYearChange.bind(this)}
        onYearUpdate={this.handleYearUpdate.bind(this)}
        toggleAnimation={this.handleToggleAnimation.bind(this)}
        playing={this.state.playing}
        citiesList={this.state.citiesList}
      />
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
