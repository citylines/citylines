Sequel.migration do
  change do
    alter_table :sections do
      add_index(:line_id)
    end

    alter_table :stations do
      add_index(:line_id)
    end

    alter_table :lines do
      add_index(:city_id)
    end
  end
end
