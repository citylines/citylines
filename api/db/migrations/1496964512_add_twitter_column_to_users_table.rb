Sequel.migration do
  change do
    alter_table :users do
      add_column :twitter, String
    end
  end
end
