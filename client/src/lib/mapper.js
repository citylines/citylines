class Mapper {
  constructor(args) {
    args = args || {};
    this.style = args.style;
    this.urlName = args.urlName;

    this.paintCache = {};
    this.filterCache = {};

    this.linesShown = [];

    this.SOURCE_TYPES = ['sections', 'stations'];
    this.sources = [];

    this.currentHoverId = {sections: ['none'], stations: ['none']};

    this.NO_HOVER_IDS = ['none'];
    // Set this.layerNames;
  }

  updateLayers() {
    this.sources = this.SOURCE_TYPES.map(type => {
        const sourceName = `${type}_source`;
        const featureType = type === 'sections' ? 'line' : 'circle';

        return {
          name: sourceName,
          layers: this.layerNames[type].map(layerName => this.layer(sourceName, layerName, featureType)),
          data: `/api/${this.urlName}/source/${type}`
        };
      }
    )
  }

  filter(layer) {
    // To implement
  }

  layer(sourceName, layerName, featureType) {
    const paint = this.style.get(layerName);
    if (JSON.stringify(this.paintCache[layerName]) != JSON.stringify(paint)) {
      this.paintCache[layerName] = paint;
    }

    const filter = this.filter(layerName);
    if (JSON.stringify(this.filterCache[layerName]) != JSON.stringify(filter)) {
      this.filterCache[layerName] = filter;
    }

    return {
      id: layerName,
      source: sourceName,
      type: featureType,
      paint: this.paintCache[layerName],
      filter: this.filterCache[layerName]
    };
  }

  setHoverIds(type, ids) {
    if ((ids && JSON.stringify(this.currentHoverId[type]) == JSON.stringify(ids)) ||
        (!ids && this.currentHoverId[type] == this.NO_HOVER_IDS)) return;

    if (!ids) {
      this.currentHoverId[type] = this.NO_HOVER_IDS;
    } else {
      this.currentHoverId[type] = ids;
    }

    this.updateLayers();
  }

  toggleLine(line, callback) {
    const index = this.linesShown.indexOf(line);
    if (index === -1) {
      this.linesShown.push(line);
    } else {
      this.linesShown.splice(index, 1);
    }

    this.updateLayers();
  }
}

export default Mapper
