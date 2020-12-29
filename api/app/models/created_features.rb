class CreatedFeature < Sequel::Model
  plugin :timestamps, :update_on_create => true
  extend ModifiedFeature
  many_to_one :user
end
