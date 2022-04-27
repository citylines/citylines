class MouseEvents {
  constructor(mapper) {
    this.mapper = mapper;
    this.layerNames = this.calculateLayerNames();
  }

  hover(features, callback) {
      const ids = {sections: [], stations: []};

      features.map((feature) => {
        const type = feature.layer.type == 'circle'? 'stations' : 'sections';
        const id = feature.properties.id;
        ids[type].push(id);
      });

      Object.entries(ids).map(([featureType, ids]) => {
        this.mapper.setHoverIds(featureType, ids);
      });

      if (typeof callback === 'function') callback();
  }

  // These are the layers where we are going to listen for mouse events
  calculateLayerNames() {
    return this.mapper.SOURCES_DATA.map(source => source.layers).flat()
      .filter(layer => !layer.includes('hover') && !layer.includes('inner'));
  }
}

export default MouseEvents
