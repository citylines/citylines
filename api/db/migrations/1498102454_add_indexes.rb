Sequel.migration do
  up do
    alter_table :sections do
      add_index :line_id
      add_column :city_id, Integer
      add_index :city_id
    end

    from(:sections).each do |section|
      line = from(:lines)[id: section[:line_id]]
      from(:sections).where(id: section[:id]).update(city_id: line[:city_id])
    end

    alter_table :sections do
      set_column_not_null :city_id
    end

    alter_table :stations do
      add_index :line_id
      add_column :city_id, Integer
      add_index :city_id
    end

    from(:stations).each do |station|
      line = from(:lines)[id: station[:line_id]]
      from(:stations).where(id: station[:id]).update(city_id: line[:city_id])
    end

    alter_table :stations do
      set_column_not_null :city_id
    end

    alter_table :lines do
      add_index :city_id
    end

    alter_table :systems do
      add_index :city_id
    end

    alter_table :section_backups do
      add_column :city_id, Integer
    end

    from(:section_backups).each do |section|
      line = from(:lines)[id: section[:line_id]]
      next unless line
      from(:section_backups).where(id: section[:id]).update(city_id: line[:city_id])
    end

    alter_table :station_backups do
      add_column :city_id, Integer
    end

    from(:station_backups).each do |station|
      line = from(:lines)[id: station[:line_id]]
      next unless line
      from(:station_backups).where(id: station[:id]).update(city_id: line[:city_id])
    end
  end

  down do
    alter_table :sections do
      drop_index :line_id
      drop_index :city_id
      drop_column :city_id
    end

    alter_table :stations do
      drop_index :line_id
      drop_index :city_id
      drop_column :city_id
    end

    alter_table :lines do
      drop_index :city_id
    end

    alter_table :systems do
      drop_index :city_id
    end

    alter_table :section_backups do
      drop_column :city_id
    end

    alter_table :station_backups do
      drop_column :city_id
    end
  end
end
