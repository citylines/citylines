module LineGroupHelpers
  RANGES_MAX_YEAR = 2050

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
      end.uniq
    ]

    group_ranges = find_ranges(feature_ranges.values)
    groups = compute_groups(feature_ranges.values, group_ranges)

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

  def compute_groups(ranges, ranges_hash)
    ranges = ranges.uniq
    groups_hash = {}
    groups = {}
    ranges_hash.each_pair do |key, vals|
      groups_hash[key] = vals.map do |val|
        if !groups[val]
          groups[val] = groups.keys.length
        end
        groups[val]
      end.uniq
    end
    groups_hash
  end

  def find_ranges(ranges)
    ranges.sort_by! {|r| r.begin}
    min_r = ranges.map(&:begin).min
    max_r = ranges.map(&:end).max
    orig_max_r = max_r
    if max_r > RANGES_MAX_YEAR
        max_r = RANGES_MAX_YEAR
    end
    curr_lines = nil
    from = min_r
    new_ranges = []
    (min_r .. max_r).each do |n|
      idxs = get_intersecting_idxs(n, ranges)
      if !curr_lines
        curr_lines = idxs
      end
      if idxs != curr_lines or n == max_r
        curr_lines = idxs
        if n == max_r
          n = orig_max_r
        end
        new_ranges << (from .. n)
        from = n
      end
    end
    Hash[
      ranges.map do |range|
        [range, new_ranges.select do |r|
          r.begin >= range.begin and r.end <= range.end
        end]
      end
    ]
  end

  def get_intersecting_idxs(n, ranges)
    ranges.map.with_index do |range, index|
      if n >= range.begin and n < range.end
        index
      end
    end.compact
  end
end
