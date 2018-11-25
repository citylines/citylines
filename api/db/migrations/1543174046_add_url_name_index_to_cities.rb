Sequel.migration do
  up do
    alter_table :cities do
      add_index :url_name
    end
  end

  down do
    alter_table :cities do
      drop_index :url_name
    end
  end
end
