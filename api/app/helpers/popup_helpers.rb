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
    section_ids = features.split(',').map do |f|
      f_parts = f.split('-')
      f_parts.last if f_parts.first == 'Section'
    end.compact

    Section.where(id: section_ids).all.map do |section|
      buildstart_end = section.opening || section.closure || FeatureCollection::Section::FUTURE
      section_closure = section.closure || FeatureCollection::Section::FUTURE

      lines = section.section_lines.map do |sl|
        line = sl.line
        {
          name: line.name,
          url_name: line.url_name,
          system: line.system.name,
          transport_mode_name: line.transport_mode.name,
          color: line.color,
          label_font_color: line_label_font_color(line.color),
          from: sl.fromyear || buildstart_end,
          to: sl.toyear || section_closure
        }
      end

      # We override buildstart and buildstart_end with
      # section data (not line data). And we add section
      # closure data.
      {
        buildstart: section.buildstart,
        buildstart_end: buildstart_end,
        section_closure: section_closure,
        length: section.length,
        lines: lines,
        section_id: section.id
      }
    end
  end
end
