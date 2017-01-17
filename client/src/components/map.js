import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

class Map extends Component {
  setMap(props) {
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

    this.map.on('moveend', () => {
      if (typeof props.onMove !== 'function') return;

      const center = this.map.getCenter();

      const geo = {
        lat: center.lat.toFixed(6),
        lon: center.lng.toFixed(6),
        zoom: this.map.getZoom().toFixed(2),
        bearing: this.map.getBearing().toFixed(2),
        pitch: this.map.getPitch().toFixed(2)
      }

      props.onMove(geo);
    });

    this.map.on('load',() => {
      if (typeof props.onLoad === 'function') props.onLoad(this.map);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.center && nextProps.center !== this.props.center && !this.map) {
      this.setMap(nextProps);
    }

    if (!this.map) return;

    if (nextProps.filter && nextProps.filter !== this.props.filter) {
      nextProps.filter.map((filter) => {
        this.map.setFilter(filter[0], filter[1]);
      });
    }
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
