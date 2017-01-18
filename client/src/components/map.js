import React, {Component} from 'react';
import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

class Map extends Component {
  constructor(props, context) {
    super(props, context);
  }

  getChildContext() {
    return {map: this.map};
  }

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

    this.map.on("mousemove", (e) => {
      const point = [e.point.x,e.point.y];
      const features = this.queryRenderedFeatures(point);
      this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      if (typeof this.props.onMouseMove === 'function') this.props.onMouseMove(point, features);
    });
  }

  queryRenderedFeatures(point){
    return this.map.queryRenderedFeatures(point, {layers: this.layerNames()});
  }

  layerNames(){
    // FIXME: retrive names from children layers
    return [
        'sections_buildstart',
        'sections_opening',
        'sections_hover',
        'stations_buildstart',
        'stations_opening',
        'stations_hover',
        'stations_inner_layer'
    ]
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
        {this.props.children}
      </main>
      )
  }
}

Map.childContextTypes = {
  map: React.PropTypes.object
}

class Source extends Component {
  componentDidMount(){
    this.map = this.context.map;
    this.load();
  }

  componentWillUnmount(){
    this.map.removeSource(this.props.name);
  }

  load() {
    if (this.map.getSource(this.props.name)) return;

    this.map.addSource(this.props.name, {
      type: 'geojson',
      data: this.props.data
    });
  }

  render() {
    return null;
  }
}

Source.contextTypes = {
  map: React.PropTypes.object
}

export {Map, Source};
