Sequel.migration do
  change do
    alter_table :section_backups do
      add_column :city_id, :Bignum
    end

    alter_table :station_backups do
      add_column :city_id, :Bignum
    end
  end
end
