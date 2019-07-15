import SatelliteControl from '../../../src/components/map/satellite-control';

class MapMock {
  constructor() {
    this.style = {layers: [], sources: {}};
  }
  addSource(name, source) {this.style.sources[name] = source}
  addLayer(layer) {this.style.layers.push(layer)}
  once(event, callback) {callback()}
  setStyle(style) {this.style.name = style}
  getStyle() {return this.style}
}

describe("SatelliteControl", () => {
  const sources = {sections_source: 'a source', stations_source: 'a source'};
  const layers = [{id: 'sections_buildstart'}, {id: 'stations_opening'}, {id: 'gl-draw-layer'}];
  const defaultStyle = 'default-style';

  it("should init the control with the default style", () => {
    const control = new SatelliteControl({
      defaultStyle: defaultStyle
    });

    const map = new MapMock();

    map.style = {
      sources: sources,
      layers: layers,
      name: defaultStyle
    }

    control.onAdd(map);

    expect(map.style.name).toEqual(defaultStyle);
    expect(control._button.className).toEqual(expect.stringContaining('fa-satellite'));

    control._button.onclick();

    expect(map.style.name).toEqual(control.styles.satellite);
    expect(map.style.sources).toEqual(sources);
    expect(map.style.layers).toEqual(layers);
    expect(control._button.className).toEqual(expect.stringContaining('fa-map'));
  });

  it("should init the control with the satellite style", () => {
    const control = new SatelliteControl({
      defaultStyle: defaultStyle,
      currentStyle: (new SatelliteControl).styles.satellite
    });

    const map = new MapMock();

    map.style = {
      sources: sources,
      layers: layers,
      name: control.styles.satellite
    }

    control.onAdd(map);

    expect(map.style.name).toEqual(control.styles.satellite);
    expect(control._button.className).toEqual(expect.stringContaining('fa-map'));

    control._button.onclick();

    expect(map.style.name).toEqual(defaultStyle);
    expect(map.style.sources).toEqual(sources);
    expect(map.style.layers).toEqual(layers);
    expect(control._button.className).toEqual(expect.stringContaining('fa-satellite'));
  });
});
