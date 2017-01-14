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
    let style;

    const colorCategory = type === 'sections' ? 'line-color' : 'circle-color';
    const styleCategory = type === 'sections' ? 'line' : 'station';

    if (operation == 'opening'){
      style = Object.assign({}, this.styles[styleCategory][operation]);

      if (type === 'sections') {
        style = Object.assign(style, this.styles[styleCategory][operation].default);
      }

      const stops = [];

      Object.keys(this.styles.line[operation]).map((l) => {
        delete style[l];
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
      style = Object.assign({},this.styles[styleCategory][operation]);
      style[colorCategory] = style["color"];
    } else if (operation === 'inner') {
      style = Object.assign({}, this.styles[styleCategory]['buildstart']);
      style["circle-color"] = style["fillColor"];
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
    return this.styles[strType]["hover"];
  }

  lineColor(lineUrlName) {
    return this.lineStyle(lineUrlName).color;
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
