Sequel.migration do
  change do
    alter_table :cities do
      add_column :country, String
    end
  end
end
