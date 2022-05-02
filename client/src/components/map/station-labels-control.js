class StationLabelsControl {
  constructor(args = {}) {
    this.onClick = args.onClick;
    this.initialShowStationLabels = args.showStationLabels;
    this._container = args.container;
  }

  onAdd(map) {
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
    if (this._container.parentNode) {
      // Another control in the same group could have already removed it
      this._container.parentNode.removeChild(this._container);
    }
  }
}

export default StationLabelsControl
