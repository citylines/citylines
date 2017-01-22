class KmInfo {
  constructor(kmLinesInfo) {
    this.kmLinesInfo = kmLinesInfo;
    this.kmOperative = null;
    this.kmUnderConstruction = null;
  }

  update(args) {
    if (args.year) this.year = args.year;
    if (args.lines) this.lines = args.lines;

    let operative = 0;
    let underConstruction = 0;

    const yearInfo = this.kmLinesInfo[this.year];

    Object.values(this.lines).map((line) => {
      if (!yearInfo[line]) return;

      if (yearInfo[line].operative) {
        operative += yearInfo[line].operative;
      }

      if (yearInfo[line].under_construction) {
        underConstruction += yearInfo[line].under_construction;
      }
    });

    operative = parseInt(operative/1000);
    underConstruction = parseInt(underConstruction/1000);

    if (operative != this.kmOperative) this.kmOperative = operative;
    if (underConstruction != this.kmUnderConstruction) this.kmUnderConstruction = underConstruction;
  }
}

export default KmInfo
