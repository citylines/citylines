class AssetsProvider {
  paths = {}

  loadPaths(paths) {
    this.paths = paths;
  }

  path(key) {
    if (this.paths[key]) {
      return this.paths[key];
    } else {
      return `/assets/${key}`;
    }
  }
}

export default new AssetsProvider();
