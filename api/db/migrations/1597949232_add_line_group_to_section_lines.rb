Sequel.migration do
  change do
    alter_table :section_lines do
      add_column :line_group, Integer, default: 0
    end
  end
end
