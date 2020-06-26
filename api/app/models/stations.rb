class Station < Sequel::Model(:stations)
  plugin :timestamps, :update_on_create => true

  include StartYear
  include FeatureBackup

  many_to_many :lines, join_table: :station_lines
  one_to_many :station_lines
  many_to_one :city

  plugin :geometry

  # This method is used with the raw json that comes from the Editor
  def self.valid_geometry?(geom)
    true
  end

  def before_destroy
    self.station_lines.map(&:destroy)
    super
  end
end
