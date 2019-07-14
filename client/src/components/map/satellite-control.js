class SatelliteControl {
  constructor(opts = {}) {
    this.styles = {
      default: opts.defaultStyle,
      satellite: 'mapbox://styles/mapbox/satellite-v9'
    };
    this.currentStyle = opts.currentStyle || this.styles.default;
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

    const button = document.createElement('button');
    button.className = 'mapbox-gl-draw_ctrl-draw-btn fa fa-globe-americas';
    button.onclick = this.switchBaseMap.bind(this);
    this._container.appendChild(button);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }

  targetStyle() {
    if (this.currentStyle == this.styles.default) {
      this.currentStyle = this.styles.satellite;
    } else {
      this.currentStyle = this.styles.default;
    }
    return this.currentStyle;
  }

  switchBaseMap() {
    const currentData = this.fetchSourcesAndLayers();
    this._map.setStyle(this.targetStyle());
    this._map.once('styledata', () => {
      this.restoreSourcesAndLayers(currentData.sources, currentData.layers);
    });
  }

  fetchSourcesAndLayers() {
    const currentStyle = this._map.getStyle();

    const layers = currentStyle.layers.filter(l => (l.id.includes('sections_') || l.id.includes('stations_')));
    const sources = {
      sections_source: currentStyle.sources.sections_source,
      stations_source: currentStyle.sources.stations_source
    };

    return {layers: layers, sources: sources};
  }

  restoreSourcesAndLayers(sources, layers) {
    Object.entries(sources).map(([name, source]) => this._map.addSource(name, source));
    layers.map(l => this._map.addLayer(l));
  }
}

export default SatelliteControl
