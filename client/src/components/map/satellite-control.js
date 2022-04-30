class SatelliteControl {
  constructor(opts = {}) {
    this.styles = {
      default: opts.defaultStyle,
      satellite: 'mapbox://styles/mapbox/satellite-v9'
    };

    this.onStyleChange = opts.onStyleChange;
    this.currentStyle = opts.currentStyle || this.styles.default;
    this._container = opts.container;
  }

  onAdd(map) {
    this._map = map;

    this._button = document.createElement('button');
    this._button.onclick = this.switchBaseMap.bind(this);
    this.setIcon();
    this._container.appendChild(this._button);

    return this._container;
  }

  onRemove() {
    if (this._container.parentNode) {
      // Another control in the same group could have already removed it
      this._container.parentNode.removeChild(this._container);
    }
    this._map = undefined;
  }

  setIcon() {
    const icon = this.currentStyle == this.styles.default ? 'fa-satellite' : 'fa-map';
    this._button.className = `mapbox-gl-draw_ctrl-draw-btn fa ${icon}`;
  }

  targetStyle() {
    let styleName = 'default';

    if (this.currentStyle == this.styles.default) {
      styleName = 'satellite';
    }

    this.currentStyle = this.styles[styleName];
    if (typeof this.onStyleChange === 'function') this.onStyleChange(styleName);

    return this.currentStyle;
  }

  switchBaseMap() {
    const currentData = this.fetchSourcesAndLayers();
    this._map.setStyle(this.targetStyle(), {diff: false});
    this.setIcon();
    this._map.once('styledata', () => {
      this.restoreSourcesAndLayers(currentData.sources, currentData.layers);
    });
  }

  fetchSourcesAndLayers() {
    const currentStyle = this._map.getStyle();

    const layers = currentStyle.layers.filter(l => (l.id.includes('sections_') || l.id.includes('stations_') || l.id.includes('gl-draw') || l.id.includes('labels')));

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
