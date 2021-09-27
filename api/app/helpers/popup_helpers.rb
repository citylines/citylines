module PopupHelpers
  def line_label_font_color(line_color)
    "##{contrasting_color(line_color[1..-1])}"
  end

  def contrasting_color(color)
    # Taken from http://stackoverflow.com/questions/635022/calculating-contrasting-colours-in-javascript/6511606#6511606
    luma(color) >= 165 ? '000' : 'fff'
  end

  def luma(color)
    rgb = color.is_a?(String) ? hex_to_rgb_array(color) : color
    (0.2126 * rgb[0]) + (0.7152 * rgb[1]) + (0.0722 * rgb[2])
  end

  def hex_to_rgb_array(color)
    if color.length === 3
      color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
    elsif color.length != 6
      raise 'Invalid hex color: ' + color
    end

    3.times.map do |i|
      Integer(color[i * 2, 2], 16)
    end
  end

  def popup_features_data(features)
    ids_by_kind = {}
    features.split(',').map do |f|
      class_name, id = f.split('-')
      ids_by_kind[class_name] ||= []
      ids_by_kind[class_name] << id
    end

    data_by_key = {}

    query = if ids = ids_by_kind['Station']
      feature_popup_query('Station', ids)
    end

    if ids = ids_by_kind['Section']
      sections_query = feature_popup_query('Section', ids)
      query = if query
        query.union(sections_query, all: true, from_self: false)
      else
        sections_query
      end
    end

    query.all.each do |feature|
      id = feature.delete(:id)
      feature[:lines].each do |line|
        line['label_font_color'] = line_label_font_color(line['color'])
        line['from'] ||= feature[:opening_fallback]
        line['to'] ||= feature[:feature_closure]
        line.delete('historic') unless line['historic']
      end
      feature.delete(:opening_fallback)
      if id.include?('Station')
        feature.delete(:length)
      else
        feature.delete(:name)
      end
      data_by_key[id] = feature
    end

    data_by_key
  end

  private

  def feature_popup_query(klass, ids)
    table_name = klass == 'Section' ? 'sections' : 'stations'
    aux_table_name = "#{table_name[0..-2]}_lines"
    aux_table_id = "#{table_name[0..-2]}_id"
    future = FeatureCollection::Section::FUTURE

    query = %Q{
      select
        concat('#{klass}','-',id) as id,
        buildstart,
        opening as opening_fallback,
        coalesce(opening,closure,#{future}) as buildstart_end,
        coalesce(closure,#{future}) as feature_closure,
        #{klass == 'Section' ? 'length' : 'null::int as length'},
        #{klass == 'Station' ? 'name' : 'null as name'},
        lines
      from #{table_name}
      left join lateral (
        select
          #{aux_table_id},
          json_agg(json_build_object('name', lines.name,'url_name',lines.url_name, 'system', coalesce(systems.name,''),'historic',systems.historic,'transport_mode_name',transport_modes.name,'color',color,'from',fromyear,'to',toyear)) as lines
        from #{aux_table_name}
          left join lines on lines.id = #{aux_table_name}.line_id
          left join systems on systems.id = system_id
          left join transport_modes on lines.transport_mode_id = transport_modes.id
        where #{aux_table_id} = #{table_name}.id
        group by #{aux_table_id}
       ) as lines_data on true
      where ?
    }

    DB.fetch(query, Sequel.expr(id: ids))
  end
end
