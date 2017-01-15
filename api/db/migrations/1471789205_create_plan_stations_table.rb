Sequel.migration do
    change do
        create_table(:plan_stations) do
            primary_key :id
            Integer :plan_line_id, :null => false
            String :name
            Geometry :geometry
        end
    end
end
