class Style {
  constructor(lines) {
    this.lines = {'shared-station': '#000000'};

    lines.map((line) => {
      this.lines[line.url_name] = line.color;
    });

    this.operationStyles = {
      'hover': {
        'color': '#000',
        'opacity': 0.4
      },
      'opening': {
      },
      'buildstart': {
        'color': '#A4A4A4'
      },
      'inner': {
        'color': '#e6e6e6'
      }
    }
  }

  get(layerName) {
    const parts = layerName.split('_');
    const type = parts[0];
    const operation = parts[1];

    return this.calculate(type, operation);
  }

  calculate(type, operation) {
    if (type == 'labels') {
      return {
        'text-color': '#464646',
        'text-halo-blur': 2,
        'text-halo-width': 3,
        'text-halo-color': '#fff',
      };
    }

    const colorCategory = type === 'sections' ? 'line-color' : 'circle-color';
    const widthCategory = type === 'sections' ? 'line-width' : 'circle-radius';

    let style = Object.assign({}, this.operationStyles[operation]);

    if (style['color']) {
      style[colorCategory] = style["color"];
      delete style["color"];
    }

    if (type === 'sections') {
      style['line-offset'] = this.zoomInterpolation('offset');
    }

    style[widthCategory] = this.zoomInterpolation('width');

    if (operation == 'opening'){
      const stops = [];

      Object.entries(this.lines).map((entry) => {
        const line = entry[0];
        const color = entry[1];
          stops.push([line, color]);
      });

      style[colorCategory] = {
        type: "categorical",
        property : "line_url_name",
        stops : stops
      }
    } else if (operation === 'hover') {
      const opacityCategory = type === 'sections' ? 'line-opacity' : 'circle-opacity';
      style[opacityCategory] = style['opacity'];
      delete style['opacity'];
    } else if (operation === 'inner') {
      style["circle-radius"] = this.zoomInterpolation('inner_width');
    }

    return style;
  }

  zoomInterpolation(property) {
    const zoomFactors = {
      7: property == 'inner_width' ? 4 : 3,
      10: 1.5
    }

    return [
         'interpolate', ['linear'], ['zoom'],
          7, ['/', ['number', ['get', property], 0], zoomFactors[7]],
          10, ['/', ['number', ['get', property], 0], zoomFactors[10]],
          12, ['number', ['get', property], 0],
        ]
  }
}

export default Style
