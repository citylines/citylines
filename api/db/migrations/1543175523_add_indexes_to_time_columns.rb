Sequel.migration do
  up do
    alter_table :sections do
      add_index :updated_at
    end

    alter_table :stations do
      add_index :updated_at
    end

    alter_table :cities do
      add_index :updated_at
    end

    alter_table :systems do
      add_index :updated_at
    end

    alter_table :lines do
      add_index :updated_at
    end

    alter_table :deleted_features do
      add_index :feature_class
      add_index :created_at
    end

    alter_table :system_backups do
      add_index :created_at
    end

    alter_table :line_backups do
      add_index :created_at
    end

    alter_table :section_lines do
      add_index :updated_at
    end

    alter_table :station_lines do
      add_index :updated_at
    end
  end

  down do
    alter_table :sections do
      drop_index :updated_at
    end

    alter_table :stations do
      drop_index :updated_at
    end

    alter_table :cities do
      drop_index :updated_at
    end

    alter_table :systems do
      drop_index :updated_at
    end

    alter_table :lines do
      drop_index :updated_at
    end

    alter_table :deleted_features do
      drop_index :feature_class
      drop_index :created_at
    end

    alter_table :system_backups do
      drop_index :created_at
    end

    alter_table :line_backups do
      drop_index :created_at
    end

    alter_table :section_lines do
      drop_index :updated_at
    end

    alter_table :station_lines do
      drop_index :updated_at
    end
  end
end
