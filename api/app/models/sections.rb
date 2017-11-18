class Section < Sequel::Model(:sections)
  plugin :timestamps, :update_on_create => true

  include Length
  include StartYear
  include FeatureBackup

  many_to_one :line
  many_to_one :city

  plugin :geometry

  FUTURE = 999999

  def build_feature(h, line, opts={})
    closure = self.closure || FUTURE

    h[:properties].merge!({length: self.length,
                           line: line.name,
                           line_url_name: line.url_name,
                           system: line.system.name || '',
                           opening: self.opening || FUTURE,
                           buildstart: self.buildstart || self.opening,
                           buildstart_end: self.opening || closure,
                           osm_id: self.osm_id,
                           osm_tags: self.osm_tags,
                           closure: closure })

    h[:properties].merge!(opts)

    h
  end

  def ranges(lines)
    width = 7
    ranges = lines/2
    arr = (-ranges..ranges).to_a
    if lines.even?
      arr = arr[0..-2]
    end
    arr.map{ |a|
      f = a * width
      if lines.even?
        f = f + width.to_f / 2
      end
      f
    }
  end

  def multiple_features(feature_hash)
    lines = other_line_ids.split(',').map{|lid| Line[lid]} + [line]
    offsets = ranges(lines.count)
    lines.each_with_index.map do |l, index|
      hash_clone = Marshal.load(Marshal.dump(feature_hash))
      build_feature(hash_clone, l, offset: offsets[index])
    end
  end

  def feature
    feature_hash = super

    if other_line_ids
      multiple_features(feature_hash)
    else
      build_feature(feature_hash, line)
    end
  end
end
