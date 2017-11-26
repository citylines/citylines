import {point, lineSlice} from "@turf/turf";

const CutLineMode = {
  onSetup: function(opts) {
    const state = {}
    return state;
  },

  onClick: function(state, e) {
    const features = this.featuresAt(e);

    // We take the first LineString
    const obj = features.find(f => f.geometry.type == "LineString");
    if (!obj) return;

    const feature = this.getFeature(obj.properties.id);

    const cursorAt = point([e.lngLat.lng, e.lngLat.lat]);

    const newFeature1 = lineSlice(point(this.firstCoord(feature)), cursorAt, feature);
    const newFeature2 = lineSlice(cursorAt, point(this.lastCoord(feature)), feature);

    this.deleteFeature(feature.id);

    [newFeature1, newFeature2].map((f) => {
      delete f.properties.id;
      delete f.properties.length;

      const nf = this.newFeature(f);

      this.addFeature(nf);
    });
  },

  toDisplayFeatures: function(state, geojson, display) {
    display(geojson);
  },

  onKeyUp: function(state, e) {
    if (e.keyCode === 27) return this.changeMode('simple_select');
  },

  firstCoord: (line) => line.coordinates[0],
  lastCoord: (line) => line.coordinates[line.coordinates.length - 1]
}

export default CutLineMode
