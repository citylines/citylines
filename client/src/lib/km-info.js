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

    if (!yearInfo) return;

    const sections = Object.values(yearInfo).filter(info => info.lines.some(l => this.lines.includes(l)))

    const keys = ['operative', 'under_construction'];

    [operative, underConstruction] = keys.map(k =>
      sections.filter(s => s[k] && s[k] > 0).map(s => s[k]).reduce((total, e) => total + e, 0)
    )

    operative = parseInt(operative/1000);
    underConstruction = parseInt(underConstruction/1000);

    if (operative != this.kmOperative) this.kmOperative = operative;
    if (underConstruction != this.kmUnderConstruction) this.kmUnderConstruction = underConstruction;
  }
}

export default KmInfo
