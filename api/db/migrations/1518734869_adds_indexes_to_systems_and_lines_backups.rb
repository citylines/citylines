Sequel.migration do
  up do
    alter_table :line_backups do
      add_index :city_id
    end

    alter_table :system_backups do
      add_index :city_id
    end
  end

  down do
    alter_table :line_backups do
      drop_index :city_id
    end

    alter_table :system_backups do
      drop_index :city_id
    end
  end
end
