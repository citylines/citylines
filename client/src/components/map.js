import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server'
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';
import PropTypes from 'prop-types';
import CutLineControl from './map/cut-line-control';
import SatelliteControl from './map/satellite-control';

class Map extends Component {
  constructor(props, context) {
    super(props, context);
  }

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
      customAttribution: '&copy; Citylines.co contributors'
    });

    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new SatelliteControl({
      defaultStyle: props.mapboxStyle,
      currentStyle: mapStyle,
      onStyleChange: this.props.onSatelliteToggle
    }));

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

  componentWillReceiveProps(nextProps) {
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
  componentWillMount(){
    this.map = this.context.map;
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

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.filter && nextProps.filter !== this.props.filter) {
      this.map.setFilter(this.props.id, nextProps.filter);
    }
  }

  load() {
    this.map.addLayer({
      id: this.props.id,
      source: this.props.source,
      type: this.props.type,
      paint: this.props.paint
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.point != this.props.point) {
      this.load(nextProps);
    }
  }

  load(props) {
    this.popup = new mapboxgl.Popup()
      .setLngLat(props.point)
      .setHTML(ReactDOMServer.renderToStaticMarkup(props.children))
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

class Draw extends Component {
  constructor(props, context) {
    super(props, context);

    this.bindedOnMapReady = this.onMapReady.bind(this);
    this.bindedOnSelectionChange = this.onSelectionChange.bind(this);
    this.bindedOnUpdate = this.onUpdate.bind(this);
    this.bindedOnCreate = this.onCreate.bind(this);
    this.bindedOnDelete = this.onDelete.bind(this);
    this.bindedOnModeChange = this.onModeChange.bind(this);
  }

  componentDidMount() {
    this.map = this.context.map;
    if (this.map.loaded()) {
      this.load();
    } else {
      this.map.on('render', this.bindedOnMapReady);
    }
  }

  componentWillUnmount() {
    if (!this.map.removed) {
      this.map.off('draw.selectionchange', this.bindedOnSelectionChange);
      this.map.off('draw.update', this.bindedOnUpdate);
      this.map.off('draw.create', this.bindedOnCreate);
      this.map.off('draw.delete', this.bindedOnDelete);
      this.map.off('draw.modechange', this.bindedOnModeChange);

      this.draw.deleteAll();
      this.map.removeControl(this.cutLineControl);
      this.map.removeControl(this.draw);
    }
    delete this.draw;
  }

  onMapReady() {
    if (!this.map.loaded()) return;
    this.map.off('render', this.bindedOnMapReady)
    this.load();
  }

  load() {
    const options = {
      boxSelect: false,
      displayControlsDefault: false,
      controls: {
        point: true,
        line_string: true,
        trash: true
      }
    }

    if (this.props.customModes) {
      options.modes = {...MapboxDraw.modes, ...this.props.customModes};
    }

    this.draw = new MapboxDraw(options);
    this.map.addControl(this.draw);

    this.cutLineControl = new CutLineControl();
    this.map.addControl(this.cutLineControl);

    this.map.on('draw.selectionchange', this.bindedOnSelectionChange);
    this.map.on('draw.update', this.bindedOnUpdate);
    this.map.on('draw.create', this.bindedOnCreate);
    this.map.on('draw.delete', this.bindedOnDelete);
    this.map.on('draw.modechange', this.bindedOnModeChange);

    this.draw.add(this.props.features);
  }

  onSelectionChange(selection) {
    if (typeof this.props.onSelectionChange === 'function') {
      this.props.onSelectionChange(selection.features);
    }
  }

  onUpdate(update) {
    if (typeof this.props.onFeatureUpdate === 'function') {
      this.props.onFeatureUpdate(update.features);
    }
  }

  onCreate(create) {
    if (typeof this.props.onFeatureCreate === 'function') {
      this.props.onFeatureCreate(create.features);
    }
  }

  onDelete(remove) {
    if (typeof this.props.onFeatureDelete === 'function') {
      this.props.onFeatureDelete(remove.features);
    }
  }

  onModeChange(modeChange) {
    if (typeof this.props.onModeChange === 'function') {
      this.props.onModeChange(modeChange.mode);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.features != this.props.features) {
      this.draw.set(nextProps.features);
    }

    if (nextProps.selectedFeatureById && nextProps.selectedFeatureById != this.props.selectedFeatureById) {
      this.draw.changeMode('simple_select', {featureIds: [nextProps.selectedFeatureById]});
    }

    if (nextProps.currentMode && nextProps.currentMode != this.props.currentMode) {
      if (this.draw.getMode() != nextProps.currentMode) {
        this.draw.changeMode(nextProps.currentMode);
      }
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}

Draw.contextTypes = {
  map: PropTypes.object
}

export {Map, Source, Popup, Draw};
