Sequel.migration do
  change do
    create_table(:system_backups) do
      primary_key :id
      Integer :original_id, :null => false
      Integer :city_id, :null => false
      String :name
      DateTime :created_at
    end
  end
end
