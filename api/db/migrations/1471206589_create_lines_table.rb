Sequel.migration do
    change do
        create_table(:lines) do
            primary_key :id
            Integer :city_id, :null => false
            String :name, :null => false
        end
    end
end
