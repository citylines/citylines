class System < Sequel::Model
  plugin :timestamps, :update_on_create => true
  include FeatureBackup

  many_to_one :city
  one_to_many :lines
end
