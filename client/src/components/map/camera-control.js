class CameraControl {
  constructor(args = {}) {
    this.onClick = args.onClick;
  }

  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';

    this._button = document.createElement('button');
    this._button.onclick = () => {
      this.onClick(this._map.getCanvas());
    };

    this._button.className = `mapbox-gl-draw_ctrl-draw-btn fa fa-camera`;
    this._container.appendChild(this._button);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

export default CameraControl
