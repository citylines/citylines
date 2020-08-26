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

    ids_by_kind.each_pair.map do |class_name, ids|
      klass = Kernel.const_get(class_name)
      klass.where(id: ids).all.map do |feature|
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
        # section data (not line data). And we add section
        # closure data.
        {
          buildstart: feature.buildstart,
          buildstart_end: buildstart_end,
          feature_closure: feature_closure,
          length: feature.is_a?(Section) && feature.length,
          name: feature.is_a?(Station) && feature.name,
          lines: lines
        }.reject{|k,v| v.blank?}
      end
    end.flatten
  end
end
