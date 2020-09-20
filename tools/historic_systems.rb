def system_latest_year(system)
  line_ids = system.lines.map(&:id)

  section_lines = SectionLine.where(line_id: line_ids).all
  sections = Hash[Section.where(id: section_lines.map(&:section_id)).map{|section| [section.id, section]}]
  section_years = section_lines.map do |section_line|
    section = sections[section_line.section_id]
    next unless section
    [section_line.fromyear || section.buildstart || section.opening, section_line.toyear || section.closure || FeatureCollection::Section::FUTURE]
  end

  station_lines = StationLine.where(line_id: line_ids).all
  stations = Hash[Station.where(id: station_lines.map(&:station_id)).map{|station| [station.id, station]}]
  station_years = station_lines.map do |station_line|
    station = stations[station_line.station_id]
    next unless station
    [station_line.fromyear || station.buildstart || station.opening, station_line.toyear || station.closure || FeatureCollection::Section::FUTURE]
  end
  (section_years + station_years).flatten.compact.max
end

def historic_systems(update = false)
  current_year = Time.now.year

  System.all.map do |system|
    max_year = system_latest_year(system)

    color = 'default'
    if max_year
      if max_year < current_year
        color = 'green'
        if update
          system.historic = true
          system.save
        end
      end
      puts colorize("#{system.name} - max year: #{max_year}", color)
      system
    end
  end.compact
end

def colorize(text, color = "default", bgColor = "default")
    colors = {"default" => "38","black" => "30","red" => "31","green" => "32","brown" => "33", "blue" => "34", "purple" => "35",
     "cyan" => "36", "gray" => "37", "dark gray" => "1;30", "light red" => "1;31", "light green" => "1;32", "yellow" => "1;33",
      "light blue" => "1;34", "light purple" => "1;35", "light cyan" => "1;36", "white" => "1;37"}
    bgColors = {"default" => "0", "black" => "40", "red" => "41", "green" => "42", "brown" => "43", "blue" => "44",
     "purple" => "45", "cyan" => "46", "gray" => "47", "dark gray" => "100", "light red" => "101", "light green" => "102",
     "yellow" => "103", "light blue" => "104", "light purple" => "105", "light cyan" => "106", "white" => "107"}
    color_code = colors[color]
    bgColor_code = bgColors[bgColor]
    return "\033[#{bgColor_code};#{color_code}m#{text}\033[0m"
end
