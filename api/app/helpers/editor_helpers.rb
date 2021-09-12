require_relative 'line_group_helpers'

module EditorHelpers
  include LineGroupHelpers

  def update_feature_lines(feature, properties)
    current_lines = feature.lines.map(&:url_name)
    updated_lines = properties[:lines].map{|l| l[:line_url_name]}

    lines_to_remove = current_lines - updated_lines
    lines_to_add = updated_lines - current_lines

    # Remove
    Line.where(url_name: lines_to_remove).all.map do |line|
      line.remove_from_feature(feature)
    end

    # Add
    Line.where(url_name: lines_to_add).all.map do |line|
      line.add_to_feature(feature)
    end

    feature.reload
    lines_to_remove.any? or lines_to_add.any?
  end

  def update_feature_line_years(feature, properties)
    modified_lines_hash = Hash[properties[:lines].map {|el| [el[:line_url_name], el]}]
    feature_lines_key = feature.is_a?(Station) ? :station_lines : :section_lines

    any_modified_lines_year = false
    feature.send(feature_lines_key).map do |feature_line|
      modified_line = modified_lines_hash[feature_line.line.url_name]
      if modified_line[:from] != feature_line.fromyear or modified_line[:to] != feature_line.toyear
        any_modified_lines_year = true
        feature_line.fromyear = modified_line[:from]
        feature_line.toyear = modified_line[:to]
        feature_line.save
      end
    end

    feature.reload
    any_modified_lines_year
  end

  def update_feature_properties(feature, properties)
    any_modified_lines = update_feature_lines(feature, properties)
    any_modified_lines_year = update_feature_line_years(feature, properties)
    if any_modified_lines or any_modified_lines_year
      set_feature_line_groups(feature)
    end

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
      new_feature = klass.new(city_id: city.id).save
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

  def feature_history(feature_class, feature_id)
    query = {feature_class: feature_class, feature_id: feature_id}
    CreatedFeature.where(query).select(:user_id, :created_at, Sequel.expr("creation").as(:type)).union(
      ModifiedFeatureProps.where(query).select(:user_id, :created_at, Sequel.expr("props").as(:type)).union(
        ModifiedFeatureGeo.where(query).select(:user_id, :created_at, Sequel.expr("geo").as(:type))
      )
    ).order(:created_at).all.map do |el|
      {
        user_nickname: el.user.nickname,
        user_url: el.user.relative_url,
        timestamp: el[:created_at].iso8601,
        type: el[:type]
      }
    end
  end

  private

  def overlapping_range(range1, range2)
    range1.first < range2.last && range2.first < range1.last ?
      [range1.min, range2.min].min .. [range1.max, range2.max].max : nil
  end
end
