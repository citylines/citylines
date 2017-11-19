Sequel.migration do
  change do
    drop_column :section_backups, :line_id
    drop_column :station_backups, :line_id
  end
end
