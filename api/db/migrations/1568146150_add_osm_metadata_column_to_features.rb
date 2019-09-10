Sequel.migration do
  change do
    alter_table :sections do
      add_column :osm_metadata, String
    end

    alter_table :stations do
      add_column :osm_metadata, String
    end

    alter_table :section_backups do
      add_column :osm_metadata, String
    end

    alter_table :station_backups do
      add_column :osm_metadata, String
    end
  end
end
