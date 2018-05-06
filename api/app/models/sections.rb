class Section < Sequel::Model(:sections)
  plugin :timestamps, :update_on_create => true

  include Length
  include StartYear
  include FeatureBackup

  many_through_many :lines, [[:section_lines, :section_id, :line_id]]
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

  # We override this from Feature module
  def formatted_feature(**opts)
    offsets = ranges(lines.count)
    lines.each_with_index.map do |l, index|
      hash_clone = Marshal.load(Marshal.dump(feature(opts)))
      hash_clone.merge(properties: feature_properties(line: l, offset: offsets[index]))
    end
  end
end
