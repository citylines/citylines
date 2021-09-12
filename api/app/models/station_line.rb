class StationLine < Sequel::Model
  plugin :timestamps, :update_on_create => true

  many_to_one :line
  one_to_many :station_line_groups

  def before_destroy
    self.station_line_groups.map(&:destroy)
    super
  end
end
