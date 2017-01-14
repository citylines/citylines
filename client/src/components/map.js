import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

class Map extends Component {
  setMap(props) {
    if (!props.center) return;

    if (this.map) {
      // FIXME: This should be coordinated with the props comparison
      return;
    }

    mapboxgl.accessToken = props.mapboxAccessToken;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: props.mapboxStyle,
      center: props.center,
      zoom: props.zoom,
      bearing: props.bearing,
      pitch: props.pitch
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load',() => {
      if (typeof props.onLoad === 'function') props.onLoad(this.map);
    });
  }

  componentWillReceiveProps(nextProps) {
    // FIXME: The following comparison should be coordinated with the `this.map` check
    // FIXME: The following comparison doesn't work
    if (nextProps !== this.props) {
      this.setMap(nextProps);
    }
  }

  componentDidMount() {
    this.setMap(this.props);
  }

  render() {
    return (
      <main className="o-grid__cell o-grid__cell--width-100 o-panel-container">
        <div id="map"></div>
      </main>
      )
  }
}

export default Map
