class Station < Sequel::Model(:stations)
  plugin :timestamps, :update_on_create => true

  include StartYear
  include FeatureBackup

  many_to_many :lines, join_table: :station_lines
  many_to_one :city

  plugin :geometry

  include Feature

  SHARED_STATION_LINE_URL_NAME = "shared-station"

  def shared_station?
    lines.count > 1
  end

  def line_url_name
    if shared_station?
      SHARED_STATION_LINE_URL_NAME
    elsif lines.first
      lines.first.url_name
    end
  end

  def lines_data
    lines.map do |l|
      {line: l.name,
       line_url_name: l.url_name,
       system: l.system.name || '',
       transport_mode_name: l.transport_mode[:name]
      }
    end
  end

  def feature_properties(**opts)
    closure = self.closure || Section::FUTURE

    data = {line_url_name: line_url_name,
            lines: lines_data,
            name: self.name,
            opening: self.opening || Section::FUTURE,
            buildstart: self.buildstart || self.opening,
            buildstart_end: self.opening || closure,
            osm_id: self.osm_id,
            osm_tags: self.osm_tags,
            closure: closure}

    if opts[:formatted]
      data.merge!(
        width: radius,
        inner_width: inner_radius
      )
    end

    # We add other line_url_name attrs if the station is shared
    # so the original url_name refers to style, and the following ones
    # are use by the client's filter function
    if shared_station?
      lines.each_with_index do |line, i|
        data["line_url_name_#{i + 1}".to_sym] = line.url_name
      end
    end

    super.merge(data)
  end

  def radius
    lines.map(&:width).max || 0
  end

  def inner_radius
    r = radius
    r < 4 ? 0 : r - 2
  end

  # This method is used with the raw json that comes from the Editor
  def self.valid_geometry?(geom)
    true
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
                      'id', id,
                      'klass', 'Station',
                      'length', name,
                      'opening', coalesce(opening, 999999),
                      'buildstart', coalesce(buildstart, opening),
                      'buildstart_end', coalesce(opening, closure, 999999),
                      'closure', coalesce(closure, 999999),
                      'lines', lines,
                      'line_url_name', (case
                                          when lines_count > 1 then 'shared-station'
                                          else first_line_url_name
                                        end),
                      'width',width,
                      'inner_width', (case
                                        when width < 4 then 0
                                        else width - 2
                                       end)
                  )
              )
          )
      ) from (
        select id, name, geometry, opening, buildstart, closure, lines, width, first_line_url_name, lines_count
        from stations
        left join (
          select all_lines.station_id as station_id, json_agg(json_build_object('line',all_lines.line,'line_url_name',all_lines.line_url_name,'system',all_lines.system, 'transport_mode_name', transport_mode_name)) as lines, coalesce(max(all_lines.width), 0) as width, (array_agg(all_lines.line_url_name))[1] as first_line_url_name, count(all_lines) as lines_count
          from (
            select station_id, lines.name as line, url_name as line_url_name, width, coalesce(systems.name,'') as system, transport_modes.name as transport_mode_name
            from station_lines
            left join lines on lines.id = station_lines.line_id
            left join systems on systems.id = system_id
            left join transport_modes on transport_modes.id = transport_mode_id
          ) as all_lines group by station_id
         ) as lines_data on station_id = stations.id
        where stations.city_id = #{opts[:city_id]}
      ) stations_data
    }

    DB.fetch(query).first[:json_build_object]
  end
end
