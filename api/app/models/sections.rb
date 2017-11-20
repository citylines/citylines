class Section < Sequel::Model(:sections)
  plugin :timestamps, :update_on_create => true

  include Length
  include StartYear
  include FeatureBackup

  one_to_many :section_lines
  many_to_one :city

  plugin :geometry

  FUTURE = 999999

  def lines
    @lines ||= section_lines.map(&:line)
  end

  def build_feature(h, line, opts={})
    closure = self.closure || FUTURE

    h[:properties].merge!(
      length: self.length,
      opening: self.opening || FUTURE,
      buildstart: self.buildstart || self.opening,
      buildstart_end: self.opening || closure,
      osm_id: self.osm_id,
      osm_tags: self.osm_tags,
      closure: closure
    )

    if line
      h[:properties].merge!(
        id: "#{id}-#{line.url_name}",
        line: line.name,
        line_url_name: line.url_name,
        system: line.system.name || '',
      )
    else
      h[:properties][:lines] = lines.map do |l|
        {
          line: l.name,
          line_url_name: l.url_name,
          system: l.system.name || ''
        }
      end
    end

    h[:properties].merge!(opts)

    h
  end

  def ranges(lines_count)
    width = 7
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

  def multiple_features(feature_hash)
    offsets = ranges(lines.count)
    lines.each_with_index.map do |l, index|
      hash_clone = Marshal.load(Marshal.dump(feature_hash))
      build_feature(hash_clone, l, offset: offsets[index])
    end
  end

  def raw_feature
    build_feature(feature, nil)
  end

  def formatted_feature
    multiple_features(feature)
  end
end
