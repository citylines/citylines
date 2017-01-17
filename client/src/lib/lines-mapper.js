import Mapper from './mapper';

class LinesMapper extends Mapper {
  constructor(args) {
    super(args);

    this.linesShown = args.linesShown || [];

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

    const filters = [];

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

        const linesShownFilter = ["in", "line_url_name"].concat(this.linesShown);
        filter.push(linesShownFilter);

        filters.push([layer, filter]);
      });
    });

    return filters;
  }

  setYear(year) {
    this.currentYear = year;
  }
}

export default LinesMapper
