class Mapper {
  constructor(args) {
    args = args || {};
    this.map = args.map;
    this.style = args.style;
    this.urlName = args.urlName;

    this.linesShown = [];
    this.currentHoverId = {sections: ['none'], stations: ['none']};

    // Set this.layers and call this.loadLayers();
  }

  filter() {
    // To implement
  }

  sources() {
    return ['sections', 'stations'].map((type) => {
      return {
        name: `${type}_source`,
        data: `/api/${this.urlName}/source/${type}`
      }
    });
  }

  loadLayers() {
    ['sections', 'stations'].map((type) => {
      Object.values(this.layers[type]).map((layer) => {
        const sourceName = `${type}_source`;
        const featureType = type === 'sections' ? 'line' : 'circle';
        this.addLayer(sourceName, layer, featureType);
      });
    });
  }

  addLayer(sourceName, layerName, featureType) {
    const layer = {
      id: layerName,
      source: sourceName,
      type: featureType,
      paint: this.style.get(layerName)
    };

    this.map.addLayer(layer);
  }

  setHoverIds(type, ids) {
    if ((ids && this.currentHoverId[type] == ids) ||
        (!ids && this.currentHoverId[type] == ['none'])) return;

    if (!ids) {
      this.currentHoverId[type] = ['none'];
    } else {
      this.currentHoverId[type] = ids;
    }
    this.filter();
  }

  toggleLine(line, callback) {
    const index = this.linesShown.indexOf(line);
    if (index === -1) {
      this.linesShown.push(line);
    } else {
      this.linesShown.splice(index, 1);
    }
  }
}

export default Mapper
