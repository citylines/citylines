Sequel.migration do
  change do
    alter_table :cities do
      add_column :country_state, String
    end
  end
end
