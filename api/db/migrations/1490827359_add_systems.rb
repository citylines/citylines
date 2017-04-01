Sequel.migration do
  change do
    create_table(:systems) do
      primary_key :id
      Integer :city_id, :null => false
      String :name
      DateTime :created_at
      DateTime :updated_at
    end

    alter_table :lines do
      add_column :system_id, Integer
    end

    alter_table :line_backups do
      add_column :system_id, Integer
    end

    from(:cities).each do |city|
      system_id = from(:systems).insert(city_id: city[:id], created_at: Time.now, updated_at: Time.now)
      from(:lines).where(city_id: city[:id]).update(system_id: system_id)
    end
  end
end
