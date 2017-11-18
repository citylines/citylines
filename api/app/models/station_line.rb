class StationLine < Sequel::Model
  plugin :timestamps, :update_on_create => true
  many_to_one :station
  many_to_one :line
end
