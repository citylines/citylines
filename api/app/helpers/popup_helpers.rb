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
end
