require_relative '../sequel/geometry'
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
          'features', coalesce(
            json_agg(
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
                        'osm_metadata', osm_metadata,
                        'opening', opening,
                        'buildstart', buildstart,
                        'closure', closure,
                        'lines', coalesce(lines,'[]'::json)
                    )
                )
              )
            ), '[]'::json
          )
      )::text
      from (
        select id, name, geometry, osm_id, osm_tags, osm_metadata, opening, buildstart, closure, lines
        from stations
        left join lateral (
          select
            station_id,
            json_agg(json_build_object('line',lines.name,'line_url_name',lines.url_name,'system',coalesce(systems.name,''),'from',fromyear,'to',toyear)) as lines
          from station_lines
            left join lines on lines.id = station_lines.line_id
            left join systems on systems.id = system_id
          where station_id = stations.id
          group by station_id
         ) as lines_data on station_id = stations.id
        where ?
      ) stations_data
    }.freeze

    FORMATTED_FEATURE_COLLECTION = %Q{
      select json_build_object(
          'type', 'FeatureCollection',
          'features', coalesce(
            json_agg(
              json_strip_nulls(
                json_build_object(
                    'type',       'Feature',
                    'geometry',   ST_AsGeoJSON(geometry, #{Sequel::Plugins::Geometry::MAX_PRECISION})::json,
                    'properties', json_build_object(
                        'id', concat(station_id,'-',line_group),
                        'klass', 'Station',
                        'opening', actual_opening,
                        'buildstart', case when actual_opening = min_fromyear or min_fromyear is null then coalesce(buildstart, opening) else actual_opening end,
                        'buildstart_end', coalesce(actual_opening, closure, #{FUTURE}),
                        'closure', coalesce(line_toyear, closure, #{FUTURE}),
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
            ), '[]'::json
          )
      )::text
      from (
        select
          stations.id as station_id,
          line_group,
          geometry,
          opening,
          coalesce(line_fromyear, opening) as actual_opening,
          buildstart,
          closure,
          line_toyear,
          least(min_fromyear, opening) as min_fromyear,
          width,
          line_url_names,
          lines_count
        from stations
        left join lateral (
          select
            station_id,
            station_line_groups.from as line_fromyear,
            station_line_groups.to as line_toyear,
            line_group,
            coalesce(max(width), 0) as width,
            array_agg(lines.url_name order by lines.id) as line_url_names,
            count(lines.id) as lines_count
          from station_lines
            left join station_line_groups on station_line_id = station_lines.id
            left join lines on lines.id = station_lines.line_id
            left join transport_modes on transport_modes.id = transport_mode_id
          where station_id = stations.id
          group by station_id, line_group, line_fromyear, line_toyear
         ) as lines_data on lines_data.station_id = stations.id
          left join lateral (
            select station_id,
            min(fromyear) as min_fromyear
            from station_lines
            where station_id = stations.id
            group by station_id
          ) as all_lines_data on all_lines_data.station_id = stations.id
        where ?
      ) stations_data
    }.freeze
  end
end
