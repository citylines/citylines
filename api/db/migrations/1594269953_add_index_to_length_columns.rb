Sequel.migration do
  up do
    alter_table :cities do
      add_index :length
    end

    alter_table :systems do
      add_index :length
    end
  end

  down do
    alter_table :cities do
      drop_index :length
    end

    alter_table :systems do
      drop_index :length
    end
  end
end
