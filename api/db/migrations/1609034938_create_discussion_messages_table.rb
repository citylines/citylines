Sequel.migration do
  change do
    create_table(:discussion_messages) do
      primary_key :id
      foreign_key :city_id, :cities
      foreign_key :user_id, :users
      String      :content, text: true, null: false
      DateTime    :created_at
      DateTime    :updated_at
    end
  end
end

