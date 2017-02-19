Sequel.migration do
  change do
    create_table(:modified_features_geo) do
      primary_key :id
      Integer :user_id, index: true
      Integer :city_id, index: true
      String :feature_class
      Integer :feature_id
      DateTime :created_at
    end

    create_table(:modified_features_props) do
      primary_key :id
      Integer :user_id, index: true
      Integer :city_id, index: true
      String :feature_class
      Integer :feature_id
      DateTime :created_at
    end

    create_table(:created_features) do
      primary_key :id
      Integer :user_id, index: true
      Integer :city_id, index: true
      String :feature_class
      Integer :feature_id
      DateTime :created_at
    end

    create_table(:deleted_features) do
      primary_key :id
      Integer :user_id, index: true
      Integer :city_id, index: true
      String :feature_class
      Integer :feature_id
      DateTime :created_at
    end
  end
end
