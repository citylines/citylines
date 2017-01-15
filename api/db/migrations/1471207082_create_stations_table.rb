Sequel.migration do
    change do
        create_table(:stations) do
            primary_key :id
            Integer :line_id, :null => false
            String :name
            Geometry :geometry
            Integer :buildstart
            Integer :opening
            Integer :closure
        end
    end
end
