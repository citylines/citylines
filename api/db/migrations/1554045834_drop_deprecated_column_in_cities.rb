Sequel.migration do
  change do
    drop_column :cities, :system_name
  end
end
