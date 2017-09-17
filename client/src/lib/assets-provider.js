class AssetsProvider {
  paths = {}

  // Sets Sprocket's manifest paths map
  loadPaths(paths) {
    this.paths = paths;
  }

  // Returns the manifest paths (production) or the default ones (development)
  path(key) {
    const target = this.paths[key] || key;
    return `/assets/${target}`;
  }
}

export default new AssetsProvider();
