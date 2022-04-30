class StationLabelsControl {
  constructor(args = {}) {
    this.onClick = args.onClick;
    this.initialShowStationLabels = args.showStationLabels;
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

    this._button = document.createElement('button');
    this._button.onclick = () => {
      this.onClick();
    };

    this.setState(this.initialShowStationLabels);
    this._container.appendChild(this._button);

    return this._container;
  }

  setState(showStationLabels) {
    const icon = showStationLabels ? 'fa-comment-slash' : 'fa-comment';
    this._button.className = `mapbox-gl-draw_ctrl-draw-btn fas ${icon}`;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }

}

export default StationLabelsControl
