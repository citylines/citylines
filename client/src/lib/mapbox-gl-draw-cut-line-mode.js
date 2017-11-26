import {point, lineSlice} from "@turf/turf";

const CutLineMode = {
  onSetup: function(opts) {
    const state = {}
    return state;
  },

  onClick: function(state, e) {
    const features = this.featuresAt(e);

    // We take the first LineString
    const feature = features.find(f => f.geometry.type == "LineString");

    if (!feature) return;

    const cursorAt = point([e.lngLat.lng, e.lngLat.lat]);

    const newFeature1 = lineSlice(point(this.firstCoord(feature)), cursorAt, feature);
    const newFeature2 = lineSlice(cursorAt, point(this.lastCoord(feature)), feature);

    this.deleteFeature(feature.properties.id);

    [newFeature1, newFeature2].map((f) => {
      this.addFeature(this.newFeature(f));
    });
  },

  toDisplayFeatures: function(state, geojson, display) {
    display(geojson);
  },

  onKeyUp: function(state, e) {
    if (e.keyCode === 27) return this.changeMode('simple_select');
  },

  firstCoord: (line) => line.geometry.coordinates[0],
  lastCoord: (line) => line.geometry.coordinates[line.geometry.coordinates.length - 1]
}

export default CutLineMode
