module WebpackHelpers
  def webpack_manifest
    WEBPACK_MANIFEST
  end

  def webpack_asset_path(name)
    webpack_manifest[name]
  end
end
