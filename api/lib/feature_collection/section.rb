require_relative '../sequel/geometry'
require_relative 'base'

module FeatureCollection
  class Section < Base
    def self.key_prefix
      'sections'
    end

    FUTURE = 999999.freeze

    RAW_FEATURE_COLLECTION = %Q{
      select json_build_object(
          'type', 'FeatureCollection',
          'features', coalesce (
            json_agg(
              json_strip_nulls(
                json_build_object(
                    'type',       'Feature',
                    'geometry',   ST_AsGeoJSON(geometry, #{Sequel::Plugins::Geometry::MAX_PRECISION})::json,
                    'properties', json_build_object(
                        'id', id,
                        'klass', 'Section',
                        'length', length,
                        'osm_id', osm_id,
                        'osm_tags', osm_tags,
                        'opening', coalesce(opening, #{FUTURE}),
                        'buildstart', coalesce(buildstart, opening),
                        'closure', coalesce(closure, #{FUTURE}),
                        'lines', lines
                    )
                )
              )
            ), '[]'::json
          )
      )::text
      from (
        select id, length, geometry, osm_id, osm_tags, opening, buildstart, closure, lines
        from sections
        left join lateral (
          select section_id, json_agg(json_build_object('line', lines.name,'line_url_name',lines.url_name, 'system', coalesce(systems.name,''))) as lines
            from section_lines
            left join lines on lines.id = section_lines.line_id
            left join systems on systems.id = system_id
            where section_id = sections.id
          group by section_id
         ) as lines_data on section_id = sections.id
        where ?
      ) sections_data
    }.freeze

    FORMATTED_FEATURE_COLLECTION = %Q{
      select json_build_object(
          'type', 'FeatureCollection',
          'features', coalesce (
            json_agg(
              json_build_object(
                  'type',       'Feature',
                  'geometry',   ST_AsGeoJSON(geometry, #{Sequel::Plugins::Geometry::MAX_PRECISION})::json,
                  'properties', json_build_object(
                      'id', concat(section_id,'-',line_url_name),
                      'klass', 'Section',
                      'length', length,
                      'opening', coalesce(opening, #{FUTURE}),
                      'buildstart', coalesce(buildstart, opening),
                      'buildstart_end', coalesce(opening, closure, #{FUTURE}),
                      'closure', coalesce(closure, #{FUTURE}),
                      'line', line,
                      'line_url_name', line_url_name,
                      'transport_mode_name', transport_mode_name,
                      'width', width,
                      'offset', (
                        case count
                        when 1 then 0
                        else
                          (case ( count % 2 )
                            when 0 then
                              (position - 1 - count / 2) * width + width::decimal / 2
                            else
                              (position - (count + 1) / 2) * width
                            end
                          )
                        end
                       ),
                      'system', system
                  )
              )
            ), '[]'::json
          )
      )::text
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
          greatest(lines_data.min_width, (
              case
                when count = 1 then lines_data.width
                when count = 2 then lines_data.width * 0.75
                else lines_data.width * 0.66
              end
          )) as width,
          array_position(all_lines, line_id) as position,
          count
        from sections
          right join section_lines
            on section_lines.section_id = sections.id
          left join lateral(
            select section_id,
              array_agg(line_id) as all_lines,
              count(line_id) as count,
              max(transport_modes.width) as width,
              max(transport_modes.min_width) as min_width
            from section_lines
              left join lines on line_id = lines.id
              left join transport_modes on lines.transport_mode_id = transport_modes.id
            where section_id = sections.id
            group by section_id
          ) as lines_data on lines_data.section_id = sections.id
          left join lines
            on line_id = lines.id
          left join systems
            on system_id = systems.id
          left join transport_modes
            on transport_modes.id = transport_mode_id
          where ?
        ) as sections_data
    }.freeze
  end
end
