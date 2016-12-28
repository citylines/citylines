import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

class Map extends Component {
  componentDidMount() {
    mapboxgl.accessToken = this.props.mapboxAccessToken;
    const map = new mapboxgl.Map({
      container: 'map',
      style: this.props.mapboxStyle,
      center: this.props.center,
      zoom: this.props.zoom,
      bearing: this.props.bearing,
      pitch: this.props.pitch
    });

    map.addControl(new mapboxgl.NavigationControl());

    map.on('load',() => {
      if (typeof this.props.onLoad === 'function') this.props.onLoad(map);
    });
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
