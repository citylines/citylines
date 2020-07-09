Sequel.migration do
  up do
    alter_table :cities do
      add_index :name, type: :gin, opclass: :gin_trgm_ops
      add_index :country, type: :gin, opclass: :gin_trgm_ops
    end

    alter_table :systems do
      add_index :name, type: :gin, opclass: :gin_trgm_ops
    end
  end

  down do
    alter_table :cities do
      drop_index :name
      drop_index :country
    end

    alter_table :systems do
      drop_index :name
    end
  end
end
