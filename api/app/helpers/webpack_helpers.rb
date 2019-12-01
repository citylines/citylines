module WebpackHelpers
  def webpack_asset_path(name)
    WEBPACK_MANIFEST[name]
  end
end
