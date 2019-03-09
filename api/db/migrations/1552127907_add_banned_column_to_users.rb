Sequel.migration do
  change do
    alter_table :users do
      add_column :banned, :boolean, default: false
    end
  end
end
