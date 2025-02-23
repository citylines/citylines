import React, {Component} from 'react';
import {renderToStaticMarkup} from 'react-dom/server'
import counterpart from 'counterpart';
import mapboxgl from 'mapbox-gl';
import PropTypes from 'prop-types';
import SatelliteControl from './map/satellite-control';
import CameraControl from './map/camera-control';
import StationLabelsControl from './map/station-labels-control';

class Map extends Component {
  getChildContext() {
    return {map: this.map};
  }

  mapId() {
    return `map${this.props.mapIndex || ""}`;
  }

  mapClass() {
    let className = "map"
    if (this.props.mapIndex == 0) className = className + " left";
    if (this.props.mapIndex == 1) className = className + " right";
    return className;
  }

  mapStyle(props) {
    if (props.mapStyle == 'satellite') {
      return (new SatelliteControl).styles.satellite;
    } else {
      return props.mapboxStyle;
    }
  }

  setMap(props) {
    const mapStyle = this.mapStyle(props);

    mapboxgl.accessToken = props.mapboxAccessToken;
    this.map = new mapboxgl.Map({
      container: this.mapId(),
      style: mapStyle,
      center: props.center,
      zoom: props.zoom,
      bearing: props.bearing,
      pitch: props.pitch,
      preserveDrawingBuffer: true,
      customAttribution: `<a href="/terms">${counterpart('terms.title')}</a> | &copy; Citylines.co contributors`
    });

    // ---- Controls -----
    // TODO: Move these controls into a separate MapControls component, child of Map
    this.map.addControl(new mapboxgl.NavigationControl());

    const container = document.createElement('div');
    container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

    this.map.addControl(new SatelliteControl({
      container: container,
      currentStyle: mapStyle,
      defaultStyle: props.mapboxStyle,
      onStyleChange: this.props.onSatelliteToggle
    }));
    this._stationLabelsControl = new StationLabelsControl({
      container: container,
      onClick: () => {this.props.onStationLabelsToggle()},
      showStationLabels: this.props.showStationLabels,
    });
    this.map.addControl(this._stationLabelsControl);
    this.map.addControl(new CameraControl({
      onClick: (canvas) => {this.props.onCameraClick(canvas)},
    }));
    // ------------------

    this.map.on('moveend', () => {
      if (typeof props.onMove === 'function') props.onMove(this.map);
    });

    this.map.on('load', () => {
      this.mapLoaded = true;
      this.forceUpdate();
      if (typeof props.onLoad === 'function') props.onLoad(this.map);
    });

    this.map.on("mousemove", (e) => {
      if (this.props.disableMouseEvents) return;

      const point = [e.point.x,e.point.y];
      const features = this.queryRenderedFeatures(point);

      const lngLat = [e.lngLat.lng, e.lngLat.lat]
      this.map.getCanvas().style.cursor = features.length ? 'pointer' : '';
      if (typeof this.props.onMouseMove === 'function') this.props.onMouseMove(lngLat, features);
    });

    this.map.on('click', (e) => {
      if (this.props.disableMouseEvents) return;

      const point = [e.point.x,e.point.y];
      const features = this.queryRenderedFeatures(point);

      const lngLat = [e.lngLat.lng, e.lngLat.lat]
      if (typeof this.props.onMouseClick === 'function') this.props.onMouseClick(lngLat, features);
    });
  }

  // taken/inspired from https://docs.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
  getUniqueFeatures(array) {
    const existingFeatureKeys = {};
    // Because features come from tiled vector data, feature geometries may be split
    // or duplicated across tile boundaries and, as a result, features may appear
    // multiple times in query results.
    const uniqueFeatures = array.filter((el) => {
      const key = el.properties.klass + '-' + el.properties.id;
      if (existingFeatureKeys[key]) {
        return false;
      } else {
        existingFeatureKeys[key] = true;
        return true;
      }
    });

    return uniqueFeatures;
  }

  queryRenderedFeatures(point){
    const features = this.map.queryRenderedFeatures(point, {layers: this.props.mouseEventsLayerNames});
    return this.getUniqueFeatures(features);
  }

  componentDidMount(){
    if (this.props.center && !this.map) {
      this.setMap(this.props);
    }
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.remove();
      this.map.removed = true;
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.center && !this.map) {
      this.setMap(nextProps);
    } else if (nextProps.center && nextProps.center != this.props.center && JSON.stringify(nextProps.center) != JSON.stringify(this.props.center)) {
      let current = this.map.getCenter().wrap();
      current = [current.lng.toFixed(6), current.lat.toFixed(6)];
      if (JSON.stringify(nextProps.center) != JSON.stringify(current)) {
        this.map.flyTo({center: nextProps.center});
      }
    }

    if (nextProps.zoom && nextProps.zoom != this.props.zoom) {
      if (this.map.getZoom().toFixed(2) != nextProps.zoom) {
        this.map.flyTo({zoom: nextProps.zoom});
      }
    }

    if (typeof nextProps.showStationLabels == 'boolean' &&
      nextProps.showStationLabels != this.props.showStationLabels &&
      this._stationLabelsControl) {
      this._stationLabelsControl.setState(nextProps.showStationLabels);
    }
  }

  render() {
    return (
      <div className={this.mapClass()}>
        <div id={this.mapId()} className="map"></div>
        { this.mapLoaded && this.props.children }
      </div>
      )
  }
}

Map.childContextTypes = {
  map: PropTypes.object
}

class Source extends Component {
  constructor(props, context) {
    super(props, context);

    this.map = context.map;
    this.load();
  }

  componentWillUnmount(){
    if (this.map.removed) {
      return;
    }

    this.props.layers.map(layer =>
      this.map.removeLayer(layer.id)
    );

    this.map.removeSource(this.props.name);
  }

  load() {
    this.map.addSource(this.props.name, {
      type: 'geojson',
      data: this.props.data
    });
  }

  render() {
    return (
      <div>
      { this.props.layers && this.props.layers.map(layer =>
        <Layer
        key={layer.id}
        id={layer.id}
        map={this.context.map}
        source={this.props.name}
        type={layer.type}
        paint={layer.paint}
        layout={layer.layout}
        filter={layer.filter}
        />
      )
      }
      </div>
    )
  }
}

Source.contextTypes = {
  map: PropTypes.object
}

class Layer extends Component {
  componentDidMount(){
    this.map = this.props.map;
    this.load();
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.filter && nextProps.filter !== this.props.filter) {
      this.map.setFilter(this.props.id, nextProps.filter);
    }

    if (nextProps.layout && this.props.layout &&
      nextProps.layout.visibility != this.props.layout.visibility) {
      this.map.setLayoutProperty(this.props.id, 'visibility', nextProps.layout.visibility);
    }
  }

  load() {
    this.map.addLayer({
      id: this.props.id,
      source: this.props.source,
      type: this.props.type,
      paint: this.props.paint,
      layout: this.props.layout,
    });

    this.map.setFilter(this.props.id, this.props.filter);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}

class Popup extends Component {
  componentDidMount() {
    this.map = this.context.map;
    this.load(this.props);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.point != this.props.point) {
      this.load(nextProps);
    }
  }

  load(props) {
    this.popup = new mapboxgl.Popup()
      .setLngLat(props.point)
      .setHTML(renderToStaticMarkup(props.children))
      .addTo(this.map)
      .on('close', () => {
        if (typeof props.onClose === 'function') props.onClose();
      });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}

Popup.contextTypes = {
  map: PropTypes.object
}

export {Map, Source, Popup};
