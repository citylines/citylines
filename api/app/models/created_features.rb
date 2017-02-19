class CreatedFeature < Sequel::Model
  plugin :timestamps, :update_on_create => true
  extend ModifiedFeature
end
