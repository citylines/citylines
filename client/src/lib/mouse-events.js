import mapboxgl from 'mapbox-gl';

class MouseEvents {
  constructor(style, mapper) {
    this.style = style;
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

      let setHoverIds = false;
      Object.entries(ids).map(([featureType, ids]) => {
        this.mapper.setHoverIds(featureType, ids);
        setHoverIds = true;
      });

      if (setHoverIds && typeof callback === 'function') callback();
  }

  calculateLayerNames() {
    return Object.values(this.mapper.layerNames).flat()
      .filter(layer => !layer.includes('hover') && !layer.includes('inner'));
  }
}

export default MouseEvents
