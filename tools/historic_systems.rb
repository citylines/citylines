def system_latest_year(system)
  system.lines.map do |line|
    section_years = line.sections.map do |section|
      [section.buildstart, section.opening, section.closure] +
        section.section_lines.map do |section_line|
        [section_line.fromyear, section_line.toyear]
      end
    end
    station_years = line.stations.map do |station|
      [station.buildstart, station.opening, station.closure] +
        station.station_lines.map do |station_line|
        [station_line.fromyear, station_line.toyear]
      end
    end
    section_years + station_years
  end.flatten.compact.max
end

def historic_systems(update = false)
  current_year = Time.now.year

  System.all.map do |system|
    max_year = system_latest_year(system)

    if max_year
      puts "#{system.name} - max year: #{max_year}"
    end
    if max_year and max_year < current_year
      if update
        system.historic = true
        system.save
      end
      system
    end
  end.compact
end
