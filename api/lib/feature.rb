module Feature
  def feature_properties(**opts)
    {
      id: self.id,
      klass: self.class.to_s
    }
  end

  def feature(geometry: geojson_geometry(:geometry), **opts)
    {
      type: "Feature",
      geometry: JSON.parse(geometry),
      properties: feature_properties(opts)
    }
  end

  def raw_feature(**opts)
    feature(opts)
  end

  def formatted_feature(**opts)
    feature(opts.merge(formatted: true))
  end
end
