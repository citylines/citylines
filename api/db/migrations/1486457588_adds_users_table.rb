Sequel.migration do
  change do
    create_table(:users) do
      primary_key :id
      String :name, null: false
      String :email, null: false
      String :crypted_password
      DateTime :created_at
      DateTime :updated_at
    end
  end
end
