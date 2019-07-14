class CutLineControl {
  onAdd(map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group cut-line-control';

    const button = document.createElement('button');
    button.className = 'mapbox-gl-draw_ctrl-draw-btn fa fa-cut';
    button.onclick = () => {
      this._map.fire('draw.modechange', {mode: 'cut_line'});
    }
    this._container.appendChild(button);

    return this._container;
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
    this._map = undefined;
  }
}

export default CutLineControl
