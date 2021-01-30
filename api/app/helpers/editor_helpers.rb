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
  end

  def update_feature_line_years(feature, properties)
    modified_lines_hash = Hash[properties[:lines].map {|el| [el[:line_url_name], el]}]
    feature_lines_klass = feature.is_a?(Station) ? StationLine : SectionLine
    attr = feature.is_a?(Station) ? :station_id : :section_id

    feature_lines_klass.where(attr => feature.id).all do |feature_line|
      modified_line = modified_lines_hash[feature_line.line.url_name]
      if modified_line[:from] != feature_line.fromyear or modified_line[:to] != feature_line.toyear
        feature_line.fromyear = modified_line[:from]
        feature_line.toyear = modified_line[:to]
        feature_line.save
      end
    end
  end

  def update_feature_line_groups(feature)
    feature_lines_klass = feature.is_a?(Station) ? StationLine : SectionLine
    attr = feature.is_a?(Station) ? :station_id : :section_id
    groups = {}

    feature_lines_klass.where(attr => feature.id).all do |feature_line|
      from = feature_line.fromyear || 0
      to = feature_line.toyear || FeatureCollection::Section::FUTURE

      added = false
      max_line_group = -1

      groups.each_pair do |line_group, group|
        max_line_group = line_group
        if new_range = overlapping_range(group[:range], from..to)
          group[:range] = new_range
          group[:feature_lines] << feature_line
          added = true
        end
      end

      unless added
        groups[max_line_group + 1] = {range: from..to, feature_lines: [feature_line]}
      end
    end

    groups.each_pair do |line_group, group|
      group[:feature_lines].each do |feature_line|
        if feature_line.line_group != line_group
          feature_line.line_group = line_group
          feature_line.save
        end
      end
    end
  end

  def update_feature_properties(feature, properties)
    update_feature_lines(feature, properties)
    update_feature_line_years(feature, properties)
    update_feature_line_groups(feature)

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

  def compute_groups(ranges)
    ranges_hash = find_ranges(ranges)
    groups_hash = {}
    groups = {}
    ranges_hash.each_pair do |key, vals|
      groups_hash[key] = vals.map do |val|
        if !groups[val]
          groups[val] = groups.keys.length
        end
        groups[val]
      end
    end
    groups_hash
  end

  def find_ranges(ranges)
    ranges_hash = {}
    ranges.each_with_index do |r, idx|
      intersections = ranges.map do |rr|
        next if r == rr
        inter_range = intersect_ranges(r, rr)
        if inter_range && inter_range.begin != inter_range.end
          inter_range
        end
      end.compact
      min_begin = intersections.map(&:begin).min
      max_end = intersections.map(&:end).max
      if min_begin && min_begin > r.begin
        intersections << (r.begin .. min_begin)
      elsif max_end && max_end < r.end
        intersections << (max_end .. r.end)
      end
      if intersections.blank?
        intersections << r
      end
      ranges_hash[r] = intersections.sort_by{|i| i.begin}
    end
    ranges_hash
  end

  def intersect_ranges(r1, r2)
    # Taken from:
    # https://stackoverflow.com/a/15273442/3095803
    new_end = [r1.end, r2.end].min
    new_begin = [r1.begin, r2.begin].max
    exclude_end = (r2.exclude_end? && new_end == r2.end) || (r1.exclude_end? && new_end == r1.end)

    valid = (new_begin <= new_end && !exclude_end)
    valid ||= (new_begin < new_end && exclude_end)
    valid ? Range.new(new_begin, new_end, exclude_end) : nil
  end
end
