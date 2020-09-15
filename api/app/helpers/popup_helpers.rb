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

    ['Station','Section'].map do |class_name|
      ids = ids_by_kind[class_name]
      klass = Kernel.const_get(class_name)
      klass.where(id: ids).order(:id).all.map do |feature|
        buildstart_end = feature.opening || feature.closure || FeatureCollection::Section::FUTURE
        feature_closure = feature.closure || FeatureCollection::Section::FUTURE
        lines_join_table_method = "#{class_name.downcase}_lines"

        lines = feature.send(lines_join_table_method).map do |sl|
          line = sl.line
          {
            name: line.name,
            url_name: line.url_name,
            system: line.system.name,
            transport_mode_name: line.transport_mode.name,
            color: line.color,
            label_font_color: line_label_font_color(line.color),
            from: sl.fromyear || buildstart_end,
            to: sl.toyear || feature_closure
          }
        end

        # We override buildstart and buildstart_end with
        # feature data (not line data). And we add feature
        # closure data.
        data_by_key[[class_name, feature.id].join('-')] = {
          buildstart: feature.buildstart,
          buildstart_end: buildstart_end,
          feature_closure: feature_closure,
          length: feature.is_a?(Section) && feature.length,
          name: feature.is_a?(Station) && feature.name,
          lines: lines
        }.reject{|k,v| v.blank?}
      end
    end

    data_by_key
  end

  def popup_features_data2(features)
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
      if query
        puts query
        puts sections_query
        query = query.union(sections_query)
      else
        query = sections_query
      end
    end

    query.all.each do |feature|
      klass = feature.delete(:klass)
      feature[:lines].each do |line|
        line['label_font_color'] = line_label_font_color(line['color'])
        line['from'] ||= feature[:buildstart_end]
        line['to'] ||= feature[:feature_closure]
      end
      data_by_key[[klass, feature[:id]].join('-')] = feature
    end

    data_by_key.reject{|k,v| v.blank?}
  end

  def feature_popup_query(klass, ids)
    table_name = klass == 'Section' ? 'sections' : 'stations'
    aux_table_name = "#{table_name[0..-2]}_lines"
    aux_table_id = "#{table_name[0..-2]}_id"

    query = %Q{
      select
        id,
        buildstart,
        coalesce(opening,closure,#{FeatureCollection::Section::FUTURE}) as buildstart_end,
        coalesce(closure,#{FeatureCollection::Section::FUTURE}) as feature_closure,
        #{klass == 'Section' ? 'length' : 'null::int as length'},
        #{klass == 'Station' ? 'name' : 'null as name'},
        '#{klass}' as klass,
        lines
      from #{table_name}
      left join lateral (
        select
          #{aux_table_id},
          jsonb_agg(jsonb_build_object('name', lines.name,'url_name',lines.url_name, 'system', coalesce(systems.name,''),'transport_mode_name',transport_modes.name,'color',color,'from',fromyear,'to',toyear)) as lines
        from #{aux_table_name}
          left join lines on lines.id = #{aux_table_name}.line_id
          left join systems on systems.id = system_id
          left join transport_modes on lines.transport_mode_id = transport_modes.id
        where #{aux_table_id} = #{table_name}.id
        group by #{aux_table_id}
       ) as lines_data on #{aux_table_id} = #{table_name}.id
      where ?
    }

    DB.fetch(query, Sequel.expr(id: ids))
  end
end
