def restore_lines_data(city, date)
  lines_checked = []
  index = 0
  LineBackup.where(city_id: city.id).where{created_at > date}.order(:created_at).map do |backup|
    unless lines_checked.include?(backup.original_id)
      line = Line[backup.original_id]
      line.color = backup.color
      line.name = backup.name
      line.save
      index = index + 1

      puts "(#{index}) -> Restored #{line.name}"
      lines_checked.push(backup.original_id)
    end
  end
end


def restore_systems_data(city, date)
  systems_checked = []
  index = 0
  SystemBackup.where(city_id: city.id).where{created_at > date}.order(:created_at).map do |backup|
    unless systems_checked.include?(backup.original_id)
      system = System[backup.original_id]
      next unless system
      system.name = backup.name
      system.save
      index = index + 1

      puts "(#{index}) -> Restored #{system.name}"
      systems_checked.push(backup.original_id)
    end
  end
end
