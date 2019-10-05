module DataHelpers
  def city_lines_data(city)
    lines = city.lines.map do |line|
      transport_mode = line.transport_mode
      system = line.system
      {
        id: line.id,
        name: line.name,
        url_name: line.url_name,
        color: line.color,
        system_id: system.id,
        system_name: system.name,
        transport_mode_id: transport_mode.id,
        transport_mode_name: transport_mode.name
      }
    end

    Naturally.sort_by(lines){|line| line[:name]}
  end
end
