Sequel.migration do
    change do
        create_table(:section_backups) do
            primary_key :id
            Integer :original_id, :null => false
            Integer :line_id, :null => false
            Geometry :geometry
            Integer :buildstart
            Integer :opening
            Integer :closure
            Integer :length
            DateTime :created_at
        end
    end
end
