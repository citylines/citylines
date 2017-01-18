class Mapper {
  constructor(args) {
    args = args || {};
    this.map = args.map;
    this.style = args.style;
    this.urlName = args.urlName;

    this.linesShown = [];
    this.currentHoverId = {sections: ['none'], stations: ['none']};

    // Set this.layers;
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

  getLayers() {
    const layers = [];

    ['sections', 'stations'].map((type) => {
      Object.values(this.layers[type]).map((layer) => {
        const sourceName = `${type}_source`;
        const featureType = type === 'sections' ? 'line' : 'circle';
        layers.push(this.layer(sourceName, layer, featureType));
      });
    });

    return layers;
  }

  layer(sourceName, layerName, featureType) {
    return {
      id: layerName,
      source: sourceName,
      type: featureType,
      paint: this.style.get(layerName),
      filter: this.filter(layerName)
    };
  }

  setHoverIds(type, ids) {
    if ((ids && this.currentHoverId[type] == ids) ||
        (!ids && this.currentHoverId[type] == ['none'])) return;

    if (!ids) {
      this.currentHoverId[type] = ['none'];
    } else {
      this.currentHoverId[type] = ids;
    }
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
