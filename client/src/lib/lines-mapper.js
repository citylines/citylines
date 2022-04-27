import Mapper from './mapper';

class LinesMapper extends Mapper {
  constructor(args) {
    super(args);

    this.linesShown = args.linesShown || [];

    this.currentYear = null;

    this.SOURCES_DATA = [
      {
        endpoint: 'sections',
        source_name: 'sections_source',
        layers: [
          {name: 'sections_buildstart', type: 'line'},
          {name: 'sections_opening', type: 'line'},
          {name: 'sections_hover', type: 'line'},
        ],
      },
      {
        endpoint: 'stations',
        source_name: 'stations_source',
        layers: [
          {name: 'stations_buildstart', type: 'circle'},
          {name: 'stations_opening', type: 'circle'},
          {name: 'stations_hover', type: 'circle'},
          {name: 'stations_inner_layer', type: 'circle'},
        ],
      },
    ];
  }

  filter(layer) {
    const hoverId = this.currentHoverId;
    const year = this.currentYear;
    const type = layer.split('_')[0];

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

    // The first line_url_name attr is present in all features.
    // But in shared stations, it's used only for styling purposes.
    // That's why shared stations have also extra line_url_name attrs: so
    // they can be filtered by the lines that use that station.
    const linesShownFilter = [
      "any",
      ["in", "line_url_name"].concat(this.linesShown),
      ["in", "line_url_name_1"].concat(this.linesShown),
      ["in", "line_url_name_2"].concat(this.linesShown),
      ["in", "line_url_name_3"].concat(this.linesShown),
      ["in", "line_url_name_4"].concat(this.linesShown),
      ["in", "line_url_name_5"].concat(this.linesShown)
    ]

    filter.push(linesShownFilter);

    return filter;
  }

  setYear(year) {
    this.currentYear = year;

    this.updateLayers();
  }
}

export default LinesMapper
