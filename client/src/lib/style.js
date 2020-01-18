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

  lineColor(lineUrlName) {
    return this.lines[lineUrlName];
  }

  lineLabelFontColor(lineUrlName){
    const lineColor = this.lineColor(lineUrlName).substr(1);
    return `#${this.contrastingColor(lineColor)}`;
  }

  contrastingColor(color) {
    // Taken from http://stackoverflow.com/questions/635022/calculating-contrasting-colours-in-javascript/6511606#6511606
    return (this.luma(color) >= 165) ? '000' : 'fff';
  }

  luma(color) {
     // color can be a hx string or an array of RGB values 0-255
    const rgb = (typeof color === 'string') ? this.hexToRGBArray(color) : color;
    return (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2]); // SMPTE C, Rec. 709 weightings
  }

  hexToRGBArray(color) {
    if (color.length === 3)
      color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2);
    else if (color.length !== 6)
      throw('Invalid hex color: ' + color);
    const rgb = [];
    for (let i = 0; i <= 2; i++)
      rgb[i] = parseInt(color.substr(i * 2, 2), 16);
    return rgb;
  }
}

export default Style
