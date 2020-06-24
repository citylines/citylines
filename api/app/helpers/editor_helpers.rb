module EditorHelpers
  def update_feature_lines(feature, properties)
    current_lines = feature.lines.map(&:url_name)
    updated_lines = properties[:lines].map{|l| l[:line_url_name]}

    lines_to_remove = current_lines - updated_lines
    lines_to_add = updated_lines - current_lines

    unless feature.id
      feature.save
    end

    # Remove
    lines_to_remove.map do |url_name|
      Line[url_name: url_name].remove_from_feature(feature)
    end

    # Add
    lines_to_add.map do |url_name|
      Line[url_name: url_name].add_to_feature(feature)
    end
  end

  def remove_lines_from_feature(feature)
    if feature.is_a?(Section)
      SectionLine.where(section_id: feature.id).map(&:delete)
    else
      StationLine.where(station_id: feature.id).map(&:delete)
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

    if feature.is_a?(Section)
      feature.set_length
      feature.save
    end
  end

  def update_metadata(systems = nil, city = nil)
    if systems
      systems.map do |system|
        system.compute_length
        system.save
      end
    end

    if city
      city.compute_length
      city.compute_contributors
      city.save
    end
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
      update_metadata(new_feature.systems, city)
      CreatedFeature.push(user, new_feature.reload)
      return
    end

    id = change[:id]
    feature = klass[id]

    feature.backup!

    logger.debug "Feature to modify #{klass} ##{id}: #{change.inspect}"

    if change[:removed]
      systems = feature.systems
      remove_lines_from_feature(feature)
      DeletedFeature.push(user, feature)
      feature.delete
      update_metadata(systems, city)
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

    update_metadata(feature.systems, city)
  end
end
