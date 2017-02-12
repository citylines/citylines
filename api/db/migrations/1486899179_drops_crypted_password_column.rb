Sequel.migration do
  change do
    drop_column :users, :crypted_password
  end
end
