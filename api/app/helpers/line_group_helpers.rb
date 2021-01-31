module LineGroupHelpers
  def set_feature_line_groups(feature)
    feature_lines_klass = feature.is_a?(Station) ? StationLine : SectionLine
    attr = feature.is_a?(Station) ? :station_id : :section_id

    feature_ranges = Hash[
      feature_lines_klass.where(attr => feature.id).all.map do |feature_line|
        from = feature_line.fromyear || 0
        to = feature_line.toyear || FeatureCollection::Section::FUTURE
        [feature_line, from..to]
      end
    ]

    groups = compute_groups(fature_ranges.values)
    feature_ranges.each_pair do |feature_line, key|
      # NOTE:
      # This assumes that we are going to store the line_groups as an array
      feature_line.line_groups = groups[key]
      feature_line.save
    end
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
