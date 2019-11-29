Sequel.migration do
  change do
    alter_table :users do
      add_column :img_url, String
    end
  end
end
