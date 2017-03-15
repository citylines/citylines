Sequel.migration do
    change do
        create_table(:line_backups) do
            primary_key :id
            Integer :original_id, :null => false
            Integer :city_id, :null => false
            String :name
            String :url_name
            String :color
            DateTime :created_at
        end
    end
end
