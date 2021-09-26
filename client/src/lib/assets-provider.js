class AssetsProvider {
  constructor() {
    this.paths = {};
    this.cdn = null;
  }

  setCDNURL(cdnURL) {
    this.cdn = cdnURL;
  }

  // Sets Sprocket's manifest paths map
  loadPaths(paths) {
    this.paths = paths;
  }

  // Returns the manifest paths with the CDN (production, staging)
  // or the default ones (development)
  path(key) {
    if (this.paths[key]) {
      return `${this.cdn}/assets/${this.paths[key]}`
    } else {
      return `/assets/${key}`;
    }
  }
}

export default new AssetsProvider();
