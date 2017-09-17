class AssetsProvider {
  paths = {}
  cdn = "//cdn.citylines.co";

  // Sets Sprocket's manifest paths map
  loadPaths(paths) {
    this.paths = paths;
  }

  // Returns the manifest paths (production) or the default ones (development)
  path(key) {
    if (this.paths[key]) {
      return `${this.cdn}/assets/${this.paths[key]}`
    } else {
      return `/assets/${key}`;
    }
  }
}

export default new AssetsProvider();
