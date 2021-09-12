module LineGroupHelpers
  def set_feature_line_groups(feature)
    feature_lines_klass = feature.is_a?(Station) ? StationLine : SectionLine
    feature_lines_key = feature.is_a?(Station) ? :station_lines : :section_lines
    feature_fkey = feature.is_a?(Station) ? :station_id : :section_id

    feature_line_groups_klass = feature.is_a?(Station) ? StationLineGroup : SectionLineGroup
    feature_line_groups_key = feature.is_a?(Station) ? :station_line_groups : :section_line_groups
    feature_line_groups_fkey = feature.is_a?(Station) ? :station_line_id : :section_line_id

    feature_lines = feature.send(feature_lines_key)

    # Delete current line groups
    feature_lines.map(&feature_line_groups_key).flatten.map(&:destroy)

    # Create new line groups
    get_line_groups_data_from_feature_lines(feature_lines) do |feature_line_id, line_group, from, to, count, order|
      feature_line_groups_klass.create(
        feature_line_groups_fkey => feature_line_id,
        :line_group => line_group,
        :from => from,
        :to => to,
        :group_members_count => count,
        :order => order,
      )
    end

    feature.reload
  end

  def get_line_groups_data_from_feature_lines(feature_lines)
    feature_ranges = Hash[
      feature_lines.map do |feature_line|
        from = feature_line[:fromyear] || 0
        to = feature_line[:toyear] || FeatureCollection::Section::FUTURE
        [feature_line, from..to]
      end
    ]

    groups = compute_groups(feature_ranges.values)
    group_ranges = find_ranges(feature_ranges.values)

    count_by_line_group = get_features_count_by_line_group(feature_ranges, groups)
    provisional_count_by_line_group = Hash.new { |h, k| h[k] = 0 }

    feature_ranges.each_pair do |feature_line, key|
      groups[key].each_with_index do |line_group, idx|
        from = group_ranges[key][idx].begin
        from = from == 0 ? nil : from
        to = group_ranges[key][idx].end
        to = to == FeatureCollection::Section::FUTURE ? nil : to

        count = count_by_line_group[line_group]
        provisional_count_by_line_group[line_group] += 1
        order = provisional_count_by_line_group[line_group]

        yield(feature_line[:id], line_group, from, to, count, order)
      end
    end
  end

  def get_features_count_by_line_group(feature_ranges, groups)
    features_count_by_line_group = Hash.new { |h, k| h[k] = 0 }
    feature_ranges.each_pair do |feature_line, key|
      groups[key].each_with_index do |line_group, idx|
        features_count_by_line_group[line_group] += 1
      end
    end
    features_count_by_line_group
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
