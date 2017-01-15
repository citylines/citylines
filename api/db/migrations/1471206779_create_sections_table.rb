Sequel.migration do
    change do
        create_table(:sections) do
            primary_key :id
            Integer :line_id, :null => false
            Geometry :geometry
            Integer :buildstart
            Integer :opening
            Integer :closure
            Integer :length 
        end
    end
end
