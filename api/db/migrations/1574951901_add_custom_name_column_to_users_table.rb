Sequel.migration do
  change do
    alter_table :users do
      add_column :custom_name, String
    end
  end
end
