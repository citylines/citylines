class SatelliteControl {
  constructor() {
    this._SATELLITE_STYLE = 'mapbox://styles/mapbox/satellite-v9';
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

    const button = document.createElement('button');
    button.className = 'mapbox-gl-draw_ctrl-draw-btn fa fa-globe-americas';
    button.onclick = () => {
      const currentStyle = this._map.getStyle();

      const layers = currentStyle.layers.filter(l => (l.id.includes('sections_') || l.id.includes('stations_')));
      const sources = {
        sections_source: currentStyle.sources.sections_source,
        stations_source: currentStyle.sources.stations_source
      };

      this._map.setStyle('mapbox://styles/mapbox/satellite-v9');

      this._map.once('styledata', () => {
        Object.entries(sources).map(([name, source]) => this._map.addSource(name, source));
        layers.map(l => this._map.addLayer(l));
      });
    }
    this._container.appendChild(button);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

export default SatelliteControl
