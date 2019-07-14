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
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group satellite-control';

    this._button = document.createElement('button');
    this._button.onclick = this.switchBaseMap.bind(this);
    this.setIcon();
    this._container.appendChild(this._button);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }

  setIcon() {
    const icon = this.currentStyle == this.styles.default ? 'fa-globe-americas' : 'fa-globe';
    this._button.className = `mapbox-gl-draw_ctrl-draw-btn fa ${icon}`;
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
    this.setIcon();
    this._map.once('styledata', () => {
      this.restoreSourcesAndLayers(currentData.sources, currentData.layers);
    });
  }

  fetchSourcesAndLayers() {
    const currentStyle = this._map.getStyle();

    const layers = currentStyle.layers.filter(l => (l.id.includes('sections_') || l.id.includes('stations_') || l.id.includes('gl-draw')));

    const sources = {};
    const validSources = ['sections_source', 'stations_source', 'mapbox-gl-draw-cold', 'mapbox-gl-draw-hot'];
    validSources.map(key => {
      if (currentStyle.sources[key]) {
        sources[key] = currentStyle.sources[key];
      }
    });

    return {layers: layers, sources: sources};
  }

  restoreSourcesAndLayers(sources, layers) {
    Object.entries(sources).map(([name, source]) => this._map.addSource(name, source));
    layers.map(l => this._map.addLayer(l));
  }
}

export default SatelliteControl
