Sequel.migration do
    change do
        create_table(:cities) do
            primary_key :id
            String :name, :null => false
            String :system_name, :null => false
            Geometry :coords
            Integer :start_year 
        end
    end
end
