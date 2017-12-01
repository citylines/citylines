import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server'
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw';

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
      if (typeof props.onMove === 'function') props.onMove(this.map);
    });

    this.map.on('load', () => {
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

  queryRenderedFeatures(point){
    return this.map.queryRenderedFeatures(point, {layers: this.props.mouseEventsLayerNames});
  }

  componentDidMount(){
    if (this.props.center && !this.map) {
      this.setMap(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.center && !this.map) {
      this.setMap(nextProps);
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
    if (this.map) this.load();
  }

  componentWillUnmount(){
    this.map.removeSource(this.props.name);
  }

  load() {
    this.map.addSource(this.props.name, {
      type: 'geojson',
      data: this.props.data
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!this.map && nextContext.map) {
      this.map = nextContext.map;
      this.load();
    }
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return null;
  }
}

Source.contextTypes = {
  map: React.PropTypes.object
}

class Layer extends Component {
  componentDidMount(){
    this.map = this.context.map;
    if (this.map) this.load();
  }

  componentWillUnmount(){
    this.map.removeLayer(this.props.id);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (!this.map && nextContext.map) {
      this.map = nextContext.map;
      this.load();
    }

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

Layer.contextTypes = {
  map: React.PropTypes.object
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
  map: React.PropTypes.object
}

class Draw extends Component {
  constructor(props, context) {
    super(props, context);

    this.bindedOnMapReady = this.onMapReady.bind(this);
    this.bindedOnSelectionChange = this.onSelectionChange.bind(this);
    this.bindedOnUpdate = this.onUpdate.bind(this);
    this.bindedOnCreate = this.onCreate.bind(this);
    this.bindedOnDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this.map = this.context.map;
    if (this.map && this.map.loaded()) {
      this.load();
    } else if (this.map) {
      this.map.on('render', this.bindedOnMapReady);
    }
  }

  componentWillUnmount() {
    this.map.off('draw.selectionchange', this.bindedOnSelectionChange);
    this.map.off('draw.update', this.bindedOnUpdate);
    this.map.off('draw.create', this.bindedOnCreate);
    this.map.off('draw.delete', this.bindedOnDelete);

    this.draw.deleteAll();
    this.map.removeControl(this.draw)
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
      const modes = {...MapboxDraw.modes, ...this.props.customModes}
      options.modes = modes;
    }

    this.draw = new MapboxDraw(options);
    this.map.addControl(this.draw);

    this.map.on('draw.selectionchange', this.bindedOnSelectionChange);
    this.map.on('draw.update', this.bindedOnUpdate);
    this.map.on('draw.create', this.bindedOnCreate);
    this.map.on('draw.delete', this.bindedOnDelete);

    this.draw.add(this.props.features);

    this.draw.changeMode('cut_line');
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.features != this.props.features) {
      this.draw.set(nextProps.features);
    }

    if (nextProps.selectedFeatureById != this.props.selectedFeatureById) {
      this.draw.changeMode('simple_select', {featureIds: [nextProps.selectedFeatureById]});
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
  map: React.PropTypes.object
}

export {Map, Source, Layer, Popup, Draw};
