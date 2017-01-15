Sequel.migration do
    change do
        create_table(:plan_lines) do
            primary_key :id
            Integer  :plan_id, :null => false
            String    :name, :null => false
            Geometry :geometry
            Integer  :length 
        end
    end
end
