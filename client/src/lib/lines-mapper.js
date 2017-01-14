import Mapper from './mapper';

class LinesMapper extends Mapper {
  constructor(args) {
    super(args);

    if (args.lines.length > 0) {
      this.linesShown = args.lines;
    }

    this.currentYear = null;

    this.layers = {
      sections: {
        BUILDSTART: 'sections_buildstart',
        OPENGING: 'sections_opening',
        HOVER: 'sections_hover'
      },
      stations: {
        BUILDSTART: 'stations_buildstart',
        OPENGING: 'stations_opening',
        HOVER: 'stations_hover',
        INNER_LAYER: 'stations_inner_layer'
      }
    };

    this.loadLayers();
  }

  filter() {
    const hoverId = this.currentHoverId;
    const year = this.currentYear;

    ['sections', 'stations'].map((type) => {
      Object.values(this.layers[type]).map((layer) => {
        let filter;

        if (layer.indexOf('hover') !== -1){
          const ids = ["in", "id"].concat(hoverId[type]);
          filter = ["all", ids];
        } else if (layer.indexOf('buildstart') !== -1) {
          filter = [
            "all",
            ["<=", "buildstart", year],
            [">", "buildstart_end", year],
          ];
        } else if (layer.indexOf('opening') !== -1){
          filter = [
            "all",
            ["<=", "opening", year],
            [">", "closure", year],
          ];
        } else if (layer.indexOf('inner') !== -1){
          filter = [
            "all",
            ["<=", "buildstart", year],
            [">", "closure", year],
          ];
        }

        if (this.linesShown) {
          const linesShownFilter = ["in", "line_url_name"].concat(this.linesShown);
          filter.push(linesShownFilter);
        }

        if (filter) this.map.setFilter(layer, filter);
      });
    });
  }

  setYear(year) {
    this.currentYear = year;
    this.filter();
  }
}

export default LinesMapper
