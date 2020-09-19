module DataHelpers
  def city_lines_systems_and_modes(city)
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
        historic: system.historic,
        project: system.project,
        transport_mode_id: transport_mode.id,
        transport_mode_name: transport_mode.name
      }.reject{|k,v| v.blank?}
    end

    Naturally.sort_by(lines){|line| line[:name]}
  end
end
