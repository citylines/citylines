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
                        'osm_metadata', osm_metadata,
                        'opening', opening,
                        'buildstart', buildstart,
                        'closure', closure,
                        'lines', coalesce(lines, '[]'::json)
                    )
                )
              )
            ), '[]'::json
          )
      )::text
      from (
        select id, length, geometry, osm_id, osm_tags, osm_metadata, opening, buildstart, closure, lines
        from sections
        left join lateral (
          select
            section_id,
            json_agg(json_build_object('line', lines.name,'line_url_name',lines.url_name, 'system', coalesce(systems.name,''),'from',fromyear,'to',toyear)) as lines
          from section_lines
            left join lines on lines.id = section_lines.line_id
            left join systems on systems.id = system_id
          where section_id = sections.id
          group by section_id
         ) as lines_data on section_id = sections.id
        where ?
      ) sections_data
    }.freeze


    # The next query uses the line group as a way of dealing with different concurrent lines at different times, on the same
    # feature.
    # Within the same line group, the (group member´s) count is the same for all elements, but the rest of the attrs differ

    FORMATTED_FEATURE_COLLECTION = %Q{
      select json_build_object(
          'type', 'FeatureCollection',
          'features', coalesce (
            json_agg(
              json_build_object(
                  'type',       'Feature',
                  'geometry',   ST_AsGeoJSON(geometry, #{Sequel::Plugins::Geometry::MAX_PRECISION})::json,
                  'properties', json_build_object(
                      'id', concat(section_id,'-',line_url_name,'-', line_group),
                      'klass', 'Section',
                      'opening', actual_opening,
                      'buildstart', case when actual_opening = min_fromyear or min_fromyear is null then coalesce(buildstart, opening) else actual_opening end,
                      'buildstart_end', coalesce(actual_opening, closure, #{FUTURE}),
                      'closure', coalesce(line_toyear, closure, #{FUTURE}),
                      'line_url_name', line_url_name,
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
                       )
                  )
              )
            ), '[]'::json
          )
      )::text
      from (
        with groups_width as (
            select line_group,
              section_id,
              max(greatest(transport_modes.min_width, (
                case
                  when section_line_groups.group_members_count = 1 then transport_modes.width
                  when section_line_groups.group_members_count = 2 then transport_modes.width * 0.75
                  else transport_modes.width * 0.66
                end
            ))) as width
            from section_lines
            join section_line_groups on section_line_id = section_lines.id
            join lines on line_id = lines.id
            join transport_modes on lines.transport_mode_id = transport_modes.id
            group by line_group, section_id
        )
        select
          sections.id as section_id,
          geometry,
          opening,
          coalesce(section_line_groups.from, opening) as actual_opening,
          buildstart,
          closure,
          section_line_groups.to as line_toyear,
          least(min_fromyear, opening) as min_fromyear,
          lines.url_name as line_url_name,
          section_line_groups.line_group,
          groups_width.width,
          section_line_groups.order as position,
          section_line_groups.group_members_count as count
        from sections
          join section_lines on section_lines.section_id = sections.id
          join section_line_groups on section_line_id = section_lines.id
          join lines on line_id = lines.id
          join groups_width on groups_width.section_id = sections.id and groups_width.line_group = section_line_groups.line_group
          join lateral (
            select section_id,
            min(fromyear) as min_fromyear
            from section_lines
            where section_id = sections.id
            group by section_id
          ) as all_lines_data on all_lines_data.section_id = sections.id
          where ?
        ) as sections_data
    }.freeze
  end
end
