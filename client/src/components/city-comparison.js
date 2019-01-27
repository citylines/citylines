import React, {PureComponent} from 'react';
import {Map, Source, Layer, Popup, Draw} from './map';

import CityStore from '../stores/city-store';

class CityComparison extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.urlNames = ["buenos-aires", "la-paz"];
  }

  componentWillMount() {
    CityStore.addChangeListener(this.onChange.bind(this));
  }

  componentWillUnmount() {
    CityStore.removeChangeListener(this.onChange.bind(this));
  }

  componentDidMount() {
    this.urlNames.map(urlName => CityStore.load(urlName, {}));
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
            mapIndex={mapIndex}
            mapboxAccessToken={state.mapbox_access_token}
            mapboxStyle={state.mapbox_style}
            center={state.coords}
            zoom={state.zoom}
            bearing={state.bearing}
            pitch={state.pitch}
            disableMouseEvents={state.playing} >
          </Map>;
        })
      }
      </main>
    );
  }
}

export default CityComparison
