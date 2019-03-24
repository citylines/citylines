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
  def self.valid_geometry?(geom)
    coords = geom[:coordinates]
    type = geom[:type]
    if type == 'LineString'
      valid_linestring?(coords)
    elsif type == 'MultiLineString'
      coords.all?{|el| valid_linestring?(el)}
    end
  end

  def self.features_collection(**opts)
    query = %Q{
      json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(
              json_build_object(
                  'type',       'Feature',
                  'geometry',   ST_AsGeoJSON(geometry, #{Sequel::Plugins::Geometry::MAX_PRECISION})::json,
                  'properties', json_build_object(
                      'id', id,
                      'klass', 'Section',
                      'length', length,
                      'osm_id', osm_id,
                      'osm_tags', osm_tags,
                      'opening', coalesce(opening, 999999),
                      'buildstart', coalesce(buildstart, opening),
                      'buildstart_end', coalesce(opening, closure, 999999),
                      'closure', coalesce(closure, 999999),
                      'lines', (
                        select json_agg(all_lines.*) from (
                          select lines.name as name, url_name, coalesce(systems.name,'') as system from lines left join section_lines on lines.id = section_lines.line_id left join systems on systems.id = system_id where sections.id = section_lines.section_id
                        ) as all_lines
                      )
                  )
              )
          )
      )
    }

    self.where(city_id: opts[:city_id]).select(Sequel.lit(query))
  end

  def self.formatted_features_collection(**opts)
    query = %Q{
      select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(
              json_build_object(
                  'type',       'Feature',
                  'geometry',   ST_AsGeoJSON(geometry, #{Sequel::Plugins::Geometry::MAX_PRECISION})::json,
                  'properties', json_build_object(
                      'id', concat(section_id,'-',line_url_name),
                      'klass', 'Section',
                      'length', length,
                      'opening', coalesce(opening, 999999),
                      'buildstart', coalesce(buildstart, opening),
                      'buildstart_end', coalesce(opening, closure, 999999),
                      'closure', coalesce(closure, 999999),
                      'line', line,
                      'line_url_name', line_url_name,
                      'transport_mode_name', transport_mode_name,
                      'width', null,
                      'offset', null,
                      'system', system
                  )
              )
          )
      )
      from (
        select
          sections.id as section_id,
          geometry,
          length,
          opening,
          buildstart,
          closure,
          lines.name as line,
          lines.url_name as line_url_name,
          coalesce(systems.name,'') as system,
          transport_modes.name as transport_mode_name,
          array_position(all_lines, line_id) as position,
          count
        from sections
          right join section_lines
            on section_lines.section_id = sections.id
          left join (
            select  lines_count.section_id,
              array_agg(lines_count.line_id) as all_lines,
              count(lines_count.line_id) as count
              from (select section_id, line_id from section_lines order by line_id) as lines_count
              group by lines_count.section_id
          ) as lines_data on lines_data.section_id = sections.id
          left join lines
            on line_id = lines.id
          left join systems
            on system_id = systems.id
          left join transport_modes
            on transport_modes.id = coalesce(transport_mode_id,0)
          where sections.city_id = #{opts[:city_id]}
          order by section_id, position
        ) as sections_data
    }

    DB.fetch(query)
  end
end
