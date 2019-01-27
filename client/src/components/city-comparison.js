import React, {PureComponent} from 'react';
import {Map, Source, Layer, Popup, Draw} from './map';

import Translate from 'react-translate-component';
import FeaturePopupContent from './city/feature-popup-content';

import CityStore from '../stores/city-store';
import CityViewStore from '../stores/city-view-store';

class CityComparison extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.urlNames = ["buenos-aires", "madrid"];
  }

  componentWillMount() {
    CityStore.addChangeListener(this.onChange.bind(this));
    CityViewStore.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnmount() {
    CityStore.removeChangeListener(this.onChange.bind(this));
    CityViewStore.removeChangeListener(this.onChange.bind(this));
  }

  componentDidMount() {
    this.urlNames.map(urlName => {
      CityStore.load(urlName, {});
      CityViewStore.load(urlName, {});
    });
  }

  onChange() {
    let newState = {};
    this.urlNames.map(urlName => newState[urlName] = CityStore.getState(urlName));
    this.setState(newState);
  }

  render() {
    if (!this.state) return null;

    return (
      <main className="o-grid__cell o-grid__cell--width-100 o-panel-container">
      {
        this.urlNames.map((urlName, mapIndex) => {
          const state = this.state[urlName];
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
