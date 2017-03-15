Sequel.migration do
    change do
        create_table(:station_backups) do
            primary_key :id
            Integer :original_id, :null => false
            Integer :line_id, :null => false
            Geometry :geometry
            Integer :buildstart
            Integer :opening
            Integer :closure
            String :name
            DateTime :created_at
        end
    end
end
