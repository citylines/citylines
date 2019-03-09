def restore_lines_data(city, range)
  lines_checked = []
  index = 0
  LineBackup.where(city_id: city.id).where(created_at: range).order(:created_at).map do |backup|
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


def restore_systems_data(city, range)
  systems_checked = []
  index = 0
  SystemBackup.where(city_id: city.id).where(created_at: range).order(:created_at).map do |backup|
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

def restore_features_props_data(class_name,city, range)
  klass = Object.const_get(class_name.capitalize)
  backup_class = Object.const_get("#{class_name.capitalize}Backup")

  features_checked = []
  index = 0

  backup_class.where(city_id: city.id).where(created_at: range).order(:created_at).map do |backup|
    unless features_checked.include?(backup.original_id)
      feature = klass[backup.original_id]

      unless feature
        "#{klass} id #{backup.original_id} missing. Skipping"
        next
      end

      if feature.is_a?(Station)
        feature.name = backup.name
      end
      feature.buildstart = backup.buildstart
      feature.opening = backup.opening
      feature.closure = backup.closure
      feature.save

      index = index + 1

      puts "(#{index}) -> Restored #{klass} id #{feature.id}"
      features_checked.push(backup.original_id)
    end
  end
end
