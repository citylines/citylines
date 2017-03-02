class Style {
  constructor(styles) {
    this.styles = styles;
  }

  get(layerName) {
    const parts = layerName.split('_');
    const type = parts[0];
    let operation = parts[1];

    // Plans use the lines style
    if (operation.indexOf('plan') !== -1) {
      operation = 'opening';
    }

    if (operation === 'hover') {
      return this.hover(type);
    }

    return this.calculate(type, operation);
  }

  calculate(type, operation) {
    // FIXME: MAPBOXGL JS still doesn't suppor data-driven line-width
    // ==============================================================
    // Now all line-widths but the one of lines opening and lines opening default should be deprecated.
    // TODO:
    // - operation: inner looks like it doesn't work
    // - hover stills uses the old style.
    // - Mapbox GL JS still doesn't support data-driven line-width
    // - When everything workds, delete from style jsons (in production) deprecated line-widths

    let style = {};

    const colorCategory = type === 'sections' ? 'line-color' : 'circle-color';
    const styleCategory = type === 'sections' ? 'line' : 'station';
    const widthCategory = type === 'sections' ? 'line-width' : 'circle-radius';

    if (['buildstart', 'opening', 'inner'].includes(operation)) {
      const widthStops = [];

      Object.keys(this.styles.line['opening']).map((l) => {
        if (l !== 'default'){
          widthStops.push([l, this.lineWidth(l) || this.lineDefaultStyle()['line-width']]);
        }
      });

      style[widthCategory] = {
        type: "categorical",
        property : "line_url_name",
        stops : widthStops
      }
    }

    if (operation == 'opening'){
      const stops = [];

      Object.keys(this.styles.line[operation]).map((l) => {
        if (l !== 'default'){
          stops.push([l, this.lineColor(l)]);
        }
      });

      style[colorCategory] = {
        type: "categorical",
        property : "line_url_name",
        stops : stops
      }

    } else if (operation === 'buildstart'){
      style[colorCategory] = this.styles[styleCategory][operation]['color'];
    } else if (operation === 'inner') {
      style["circle-color"] = this.styles[styleCategory]['buildstart']["fillColor"];
      style["circle-radius"] = style["circle-radius"] - 3;
    }

    if (type !== 'sections') {
      delete style["line-width"];
    }

    delete style["labelFontColor"];
    delete style["fillColor"];
    delete style["color"];

    return style;
  }

  hover(type) {
    const strType = (type == 'stations') ? 'station' : 'line';
    // FIXME: this should use the general line-width method
    return this.styles[strType]["hover"];
  }

  lineColor(lineUrlName) {
    return this.lineStyle(lineUrlName).color;
  }

  lineWidth(lineUrlName) {
    return this.lineStyle(lineUrlName)['line-width'];
  }

  lineLabelFontColor(lineUrlName){
    return this.lineStyle(lineUrlName).labelFontColor;
  }

  lineStyle(lineUrlName) {
    return this.styles.line.opening[lineUrlName];
  }

  lineDefaultStyle() {
    return this.styles.line.opening.default;
  }
}

export default Style
