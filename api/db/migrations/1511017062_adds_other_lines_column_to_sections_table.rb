Sequel.migration do
  change do
    alter_table :sections do
      add_column :other_line_ids, String, null: true
    end
  end
end
