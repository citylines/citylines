Sequel.migration do
  change do
    alter_table :lines do
      add_column :transport_mode_id, Integer
    end
  end
end
