Sequel.migration do
  change do
    alter_table :sections do
      add_column :created_at, DateTime
      add_column :updated_at, DateTime
    end

    alter_table :stations do
      add_column :created_at, DateTime
      add_column :updated_at, DateTime
    end
  end
end
