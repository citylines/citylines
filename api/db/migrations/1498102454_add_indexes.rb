Sequel.migration do
  change do
    alter_table :sections do
      add_index :line_id
      add_column :city_id, Integer
      add_index :city_id
    end

    from(:sections).each do |section|
      line = from(:lines)[id: section[:line_id]]
      next unless line
      from(:sections).where(id: section[:id]).update(city_id: line[:city_id])
    end

    alter_table :stations do
      add_index :line_id
      add_column :city_id, Integer
      add_index :city_id
    end

    from(:stations).each do |station|
      line = from(:lines)[id: station[:line_id]]
      next unless line
      from(:stations).where(id: station[:id]).update(city_id: line[:city_id])
    end

    alter_table :lines do
      add_index :city_id
    end

    alter_table :systems do
      add_index :city_id
    end
  end
end
