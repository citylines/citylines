module EditorHelpers
  def update_feature_lines(feature, properties)
    current_lines = feature.lines.map(&:url_name)
    updated_lines = properties[:lines].map{|l| l[:line_url_name]}

    lines_to_remove = current_lines - updated_lines
    lines_to_add = updated_lines - current_lines

    unless feature.id
      feature.save
    end

    # Remove
    Line.where(url_name: lines_to_remove).all.map do |line|
      line.remove_from_feature(feature)
    end

    # Add
    Line.where(url_name: lines_to_add).all.map do |line|
      line.add_to_feature(feature)
    end

    # line years
    modified_lines_hash = Hash[properties[:lines].map {|el| [el[:line_url_name], el]}]
    relac_klass = feature.is_a?(Station) ? StationLine : SectionLine
    attr = feature.is_a?(Station) ? :station_id : :section_id
    relac_klass.where(attr => feature.id).all do |feature_line|
      modified_line = modified_lines_hash[feature_line.line.url_name]
      if modified_line[:from] != feature_line.fromyear or modified_line[:to] != feature_line.toyear
        feature_line.fromyear = modified_line[:from]
        feature_line.toyear = modified_line[:to]
        feature_line.save
      end
    end
  end

  def update_feature_properties(feature, properties)
    update_feature_lines(feature, properties)

    feature.buildstart = properties[:buildstart]
    feature.opening = properties[:opening]
    feature.closure = properties[:closure]
    feature.name = properties[:name] if feature.is_a?(Station)

    # osm properties
    feature.osm_tags = properties[:osm_tags]
    feature.osm_id = properties[:osm_id]
    feature.osm_metadata = properties[:osm_metadata]

    feature.save
  end

  def update_feature_geometry(feature, geometry)
    feature.set_geometry_from_geojson(geometry)
    feature.save
  end

  def update_create_or_delete_feature(city, user, change)
    klass = Object.const_get(change[:klass])

    if change[:created] || change[:geo]
      unless klass.valid_geometry?(change[:feature][:geometry])
        logger.debug("Invalid geometry: #{change.inspect}")
        return
      end
    end

    if change[:created]
      new_feature = klass.new(city_id: city.id)
      update_feature_properties(new_feature, change[:feature][:properties])
      update_feature_geometry(new_feature.reload, change[:feature][:geometry])
      CreatedFeature.push(user, new_feature.reload)
      return
    end

    id = change[:id]
    feature = klass[id]

    feature.backup!

    logger.debug "Feature to modify #{klass} ##{id}: #{change.inspect}"

    if change[:removed]
      DeletedFeature.push(user, feature)
      feature.destroy
      return
    end

    if change[:props]
      update_feature_properties(feature, change[:feature][:properties])
      ModifiedFeatureProps.push(user, feature)
    end

    if change[:geo]
      update_feature_geometry(feature, change[:feature][:geometry])
      ModifiedFeatureGeo.push(user, feature)
    end
  end
end
