Sequel.migration do
    change do
        create_table(:plans) do
            primary_key :id
            Integer :city_id, :null => false
            String :name, :null => false
            Json :extra
        end
    end
end
