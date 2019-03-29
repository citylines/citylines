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
          'features', json_agg(
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
          )
      )::text
      from (
        select id, length, geometry, osm_id, osm_tags, opening, buildstart, closure, lines
        from sections
        left join (
          select all_lines.section_id as section_id, json_agg(json_build_object('line',all_lines.line,'line_url_name',all_lines.line_url_name,'system',all_lines.system)) as lines from (
            select section_id, lines.name as line, url_name as line_url_name, coalesce(systems.name,'') as system
            from section_lines
            left join lines on lines.id = section_lines.line_id
            left join systems on systems.id = system_id
          ) as all_lines group by section_id
         ) as lines_data on section_id = sections.id
        where ?
      ) sections_data
    }.freeze

    FORMATTED_FEATURE_COLLECTION = %Q{
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
          greatest(width_data.min_width, (
              case
                when count = 1 then width_data.width
                when count = 2 then width_data.width * 0.75
                else width_data.width * 0.66
              end
          )) as width,
          array_position(all_lines, line_id) as position,
          count
        from sections
          right join section_lines
            on section_lines.section_id = sections.id
          left join (
            select lines_count.section_id,
              array_agg(lines_count.line_id) as all_lines,
              count(lines_count.line_id) as count
              from (select section_id, line_id from section_lines) as lines_count
              group by lines_count.section_id
          ) as lines_data on lines_data.section_id = sections.id
          left join (
            select section_id as width_section_id, max(transport_modes.width) as width, max(transport_modes.min_width) as min_width from
            section_lines
            left join lines on line_id = lines.id
            left join transport_modes on lines.transport_mode_id = transport_modes.id
            group by width_section_id
          ) as width_data on sections.id = width_section_id
          left join lines
            on line_id = lines.id
          left join systems
            on system_id = systems.id
          left join transport_modes
            on transport_modes.id = transport_mode_id
          where ?
          order by section_id, position
        ) as sections_data
    }.freeze
  end
end
