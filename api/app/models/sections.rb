class Section < Sequel::Model(:sections)
  plugin :timestamps, :update_on_create => true

  include Length
  include StartYear
  include FeatureBackup

  many_to_many :lines, join_table: :section_lines
  many_to_one :city

  plugin :geometry

  include Feature

  FUTURE = 999999

  def feature_properties(line: nil, **opts)
    closure = self.closure || FUTURE

    h = {
      length: self.length,
      opening: self.opening || FUTURE,
      buildstart: self.buildstart || self.opening,
      buildstart_end: self.opening || closure,
      osm_id: self.osm_id,
      osm_tags: self.osm_tags,
      closure: closure
    }

    if line
      h.merge!(
        id: "#{id}-#{line.url_name}",
        line: line.name,
        line_url_name: line.url_name,
        transport_mode_name: line.transport_mode[:name],
        width: width,
        system: line.system.name || '',
      )
    else
      h[:lines] = lines.map do |l|
        {
          line: l.name,
          line_url_name: l.url_name,
          system: l.system.name || ''
        }
      end
    end

    super.merge(h).merge(opts)
  end

  def ranges(lines_count)
    ranges = lines_count/2
    arr = (-ranges..ranges).to_a
    if lines_count.even?
      arr = arr[0..-2]
    end
    arr.map{ |a|
      f = a * width
      if lines_count.even?
        f = f + width.to_f / 2
      end
      f
    }
  end

  # We override this from Feature module
  def formatted_feature(**opts)
    offsets = ranges(lines.count)
    lines.each_with_index.map do |l, index|
      hash_clone = Marshal.load(Marshal.dump(feature(opts)))
      hash_clone.merge(properties: feature_properties(line: l, offset: offsets[index]))
    end
  end

  def width
    l = lines.sort_by{|l| l.width}.last
    return unless l

    default_width = l.width
    min_width = l.min_width

    target_width = case lines.count
                   when 1
                     default_width
                   when 2
                     default_width * 0.75
                   else
                     default_width * 0.66
                   end

    target_width = min_width if target_width < min_width
    target_width
  end

  # This method is used with the raw json that comes from the Editor
  # Although this method could consider as valid erroneus MultiLineStrings
  # in Citylines we only work with LineStrings (which come from OSM or from
  # the Editor manual input)
  def self.valid_geometry?(geom)
    coords = geom[:coordinates]
    coords.first.is_a?(Array) && coords.length > 1
  end
end
