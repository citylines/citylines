class MouseEvents {
  constructor(mapper) {
    this.WITHOUT_EVENTS_KEYWORDS = ['hover', 'inner', 'labels'];
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
    const allLayerNames = this.mapper.SOURCES_DATA.map(source => source.layers.map(layer => layer.name)).flat();
    return allLayerNames.filter(layer =>
      !this.WITHOUT_EVENTS_KEYWORDS.some(keyword =>
        layer.includes(keyword)
      )
    );
  }
}

export default MouseEvents
