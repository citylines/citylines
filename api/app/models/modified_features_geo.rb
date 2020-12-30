class ModifiedFeatureGeo < Sequel::Model(:modified_features_geo)
  plugin :timestamps, :update_on_create => true
  extend ModifiedFeature
  many_to_one :user
end
