Sequel.migration do
  up do
    alter_table :systems do
      add_column :historic, TrueClass, default: false
    end

    alter_table :system_backups do
      add_column :historic, TrueClass, default: false
    end
  end

  down do
    alter_table :systems do
      drop_column :historic
    end

    alter_table :system_backups do
      drop_column :historic
    end
  end
end
