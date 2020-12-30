class ModifiedFeatureProps < Sequel::Model(:modified_features_props)
  plugin :timestamps, :update_on_create => true
  extend ModifiedFeature
  many_to_one :user
end
