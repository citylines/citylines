require_relative 'base'

module FeatureCollection
  class Station < Base
    def self.key_prefix
      'stations'
    end

    FUTURE = 999999.freeze
    SHARED_STATION_LINE_URL_NAME = "shared-station".freeze

    RAW_FEATURE_COLLECTION = %Q{
      select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(
              json_strip_nulls(
                json_build_object(
                    'type',       'Feature',
                    'geometry',   ST_AsGeoJSON(geometry, #{Sequel::Plugins::Geometry::MAX_PRECISION})::json,
                    'properties', json_build_object(
                        'id', id,
                        'klass', 'Station',
                        'name', name,
                        'osm_id', osm_id,
                        'osm_tags', osm_tags,
                        'opening', coalesce(opening, #{FUTURE}),
                        'buildstart', coalesce(buildstart, opening),
                        'closure', coalesce(closure, #{FUTURE}),
                        'lines', lines
                    )
                )
              )
          )
      )::text
      from (
        select id, name, geometry, osm_id, osm_tags, opening, buildstart, closure, lines
        from stations
        left join (
          select
            all_lines.station_id as station_id,
            json_agg(json_build_object('line',all_lines.line,'line_url_name',all_lines.line_url_name,'system',all_lines.system,'transport_mode_name',transport_mode_name)) as lines
          from (
            select station_id, lines.name as line, url_name as line_url_name, coalesce(systems.name,'') as system, transport_modes.name as transport_mode_name
            from station_lines
            left join lines on lines.id = station_lines.line_id
            left join systems on systems.id = system_id
            left join transport_modes on transport_modes.id = transport_mode_id
          ) as all_lines group by station_id
         ) as lines_data on station_id = stations.id
        where ?
      ) stations_data
    }.freeze

    FORMATTED_FEATURE_COLLECTION = %Q{
      select json_build_object(
          'type', 'FeatureCollection',
          'features', json_agg(
              json_strip_nulls(
                json_build_object(
                    'type',       'Feature',
                    'geometry',   ST_AsGeoJSON(geometry, #{Sequel::Plugins::Geometry::MAX_PRECISION})::json,
                    'properties', json_build_object(
                        'id', id,
                        'klass', 'Station',
                        'name', name,
                        'opening', coalesce(opening, #{FUTURE}),
                        'buildstart', coalesce(buildstart, opening),
                        'buildstart_end', coalesce(opening, closure, #{FUTURE}),
                        'closure', coalesce(closure, #{FUTURE}),
                        'lines', lines,
                        'line_url_name', (case
                                            when lines_count > 1 then '#{SHARED_STATION_LINE_URL_NAME}'
                                            else line_url_names[1]
                                          end),
                        'line_url_name_1', (case when lines_count > 1 then line_url_names[1] else null end),
                        'line_url_name_2', line_url_names[2],
                        'line_url_name_3', line_url_names[3],
                        'line_url_name_4', line_url_names[4],
                        'line_url_name_5', line_url_names[5],
                        'width',width,
                        'inner_width', (case
                                          when width < 4 then 0
                                          else width - 2
                                         end)
                    )
                  )
              )
          )
      )::text
      from (
        select id, name, geometry, opening, buildstart, closure, lines, width, line_url_names, lines_count
        from stations
        left join (
          select
            all_lines.station_id as station_id,
            json_agg(json_build_object('line',all_lines.line,'line_url_name',all_lines.line_url_name,'system',all_lines.system,'transport_mode_name',transport_mode_name)) as lines,
            coalesce(max(all_lines.width), 0) as width,
            array_agg(all_lines.line_url_name) as line_url_names,
            count(all_lines) as lines_count
          from (
            select station_id, lines.name as line, url_name as line_url_name, width, coalesce(systems.name,'') as system, transport_modes.name as transport_mode_name
            from station_lines
            left join lines on lines.id = station_lines.line_id
            left join systems on systems.id = system_id
            left join transport_modes on transport_modes.id = transport_mode_id
          ) as all_lines group by station_id
         ) as lines_data on station_id = stations.id
        where ?
      ) stations_data
    }.freeze
  end
end
