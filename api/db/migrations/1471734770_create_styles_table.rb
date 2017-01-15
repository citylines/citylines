Sequel.migration do
    change do
        create_table(:styles) do
            primary_key :id
            Integer :city_id, :null => false
            Json :style
        end
    end
end
