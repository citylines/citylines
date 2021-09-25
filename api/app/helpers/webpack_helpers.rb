module WebpackHelpers
  def webpack_manifest
    WEBPACK_MANIFEST
  end

  def cdn_url
    CDN_URL
  end

  def webpack_asset_path(name)
    unless webpack_manifest[name]
      return nil
    end
    path = "/assets/#{webpack_manifest[name]}"
    if cdn_url
      "#{cdn_url}#{path}"
    else
      path
    end
  end
end
