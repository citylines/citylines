class Mapper {
  constructor(args) {
    args = args || {};
    this.style = args.style;
    this.urlName = args.urlName;

    this.paintCache = {};
    this.filterCache = {};

    this.linesShown = [];

    this.sources = [];

    this.currentHoverId = {sections: [], stations: []};
  }

  updateLayers() {
    this.sources = this.SOURCES_DATA.map(sourceData => {
        return {
          name: sourceData.source_name,
          layers: sourceData.layers.map(layer => this.layer(sourceData.source_name, layer.name, layer.type)),
          data: `/api/${this.urlName}/source/${sourceData.endpoint}`
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
    if (!ids.length && !this.currentHoverId[type].length) {
      return;
    }
    if (ids.length && JSON.stringify(this.currentHoverId[type]) == JSON.stringify(ids)) {
      return;
    }

    this.currentHoverId[type] = ids;
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
