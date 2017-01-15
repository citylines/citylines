import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

class MouseEvents {
  constructor(map, style, mappers) {
    this.map = map;
    this.style = style;
    this.mappers = mappers;

    map.on("mousemove", (e) => {
      const point = [e.point.x,e.point.y];
      const features = this.queryRenderedFeatures(point);
      const ids = {lines: {sections: [], stations: []}, plans: {sections: [], stations: []}};

      map.getCanvas().style.cursor = features.length ? 'pointer' : '';

      features.map((feature) => {
        const type = feature.layer.type == 'circle'? 'stations' : 'sections';
        const id = feature.properties.id;

        const mapperType = feature.properties.plan ? 'plans' : 'lines';

        ids[mapperType] = ids[mapperType] || {};
        ids[mapperType][type] = ids[type] || [];
        ids[mapperType][type].push(id);
      });

      Object.entries(this.mappers).map((entry) => {
        const mapperType = entry[0];
        const mapper = entry[1];
        if (typeof ids[mapperType] === 'undefined') return;
        Object.entries(ids[mapperType]).map((idEntry) => {
          const type = idEntry[0];
          const idsMapperType = idEntry[1];
          mapper.setHoverIds(type, idsMapperType);
        });
      });
    });

  }

  layerNames() {
    const layers = [];
    Object.values(this.mappers).map((mapper) => {
      Object.values(mapper.layers).map((type) => {
        Object.values(type).map((layer) => {
          if (layer.indexOf('hover') === -1 && layer.indexOf('inner') === -1) {
            layers.push(layer);
          }
        });
      });
    });
    return layers;
  }

  queryRenderedFeatures(point){
    return this.map.queryRenderedFeatures(point, {layers: this.layerNames()});
  }
}

export default MouseEvents
