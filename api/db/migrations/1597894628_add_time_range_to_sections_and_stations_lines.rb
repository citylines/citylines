Sequel.migration do
  change do
    alter_table :section_lines do
      add_column :fromyear, Integer
      add_column :toyear, Integer
    end

    alter_table :station_lines do
      add_column :fromyear, Integer
      add_column :toyear, Integer
    end
  end
end
