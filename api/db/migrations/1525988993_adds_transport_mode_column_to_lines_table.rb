Sequel.migration do
  up do
    alter_table :lines do
      add_column :transport_mode_id, Integer
    end

    alter_table :line_backups do
      add_column :transport_mode_id, Integer
    end
  end

  down do
    alter_table :lines do
      drop_column :transport_mode_id
    end

    alter_table :line_backups do
      drop_column :transport_mode_id
    end
  end
end
