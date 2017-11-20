Sequel.migration do
  change do
    create_table(:section_lines) do
      primary_key :id
      Integer :section_id, null: false, index: true
      Integer :line_id, null: false
      DateTime :created_at
      DateTime :updated_at
    end

    from(:sections).each do |section|
      from(:section_lines).insert(section_id: section[:id], line_id: section[:line_id])
    end

    drop_column :sections, :line_id
  end
end
