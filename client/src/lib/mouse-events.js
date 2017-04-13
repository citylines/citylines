import mapboxgl from 'mapbox-gl';

class MouseEvents {
  constructor(style, mappers) {
    this.style = style;
    this.mappers = mappers;

    this.layerNames = this.calculateLayerNames();
  }

  hover(features, callback) {
      const ids = {lines: {sections: [], stations: []}, plans: {sections: [], stations: []}};

      features.map((feature) => {
        const type = feature.layer.type == 'circle'? 'stations' : 'sections';
        const id = feature.properties.id;

        const mapperType = feature.properties.plan ? 'plans' : 'lines';

        ids[mapperType] = ids[mapperType] || {};
        ids[mapperType][type] = ids[mapperType][type] || [];
        ids[mapperType][type].push(id);
      });

      let setHoverIds = false;
      Object.entries(this.mappers).map((entry) => {
        const mapperType = entry[0];
        const mapper = entry[1];
        if (typeof ids[mapperType] === 'undefined') return;
        Object.entries(ids[mapperType]).map((idEntry) => {
          const type = idEntry[0];
          const idsMapperType = idEntry[1];
          mapper.setHoverIds(type, idsMapperType);
          setHoverIds = true;
        });
      });

      if (setHoverIds && typeof callback === 'function') callback();
  }

  clickFeatures(point, features, callback) {
    if (features.length == 0) return;

    this.clickedFeatures = {
      point: point,
      features: features.map((f) => {
        f.properties.lineColor = this.style.lineColor(f.properties.line_url_name);
        f.properties.lineLabelColor = this.style.lineLabelFontColor(f.properties.line_url_name);
        return f;
      })
    }

    if (typeof callback === 'function') callback();
  }

  unClickFeatures() {
    this.clickedFeatures = null;
  }

  calculateLayerNames() {
    const layers = [];
    Object.values(this.mappers).map((mapper) => {
      Object.values(mapper.layerNames).map((type) => {
        Object.values(type).map((layer) => {
          if (!layer.includes('hover') && !layer.includes('inner')) {
            layers.push(layer);
          }
        });
      });
    });
    return layers;
  }
}

export default MouseEvents
