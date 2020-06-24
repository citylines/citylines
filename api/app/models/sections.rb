class Section < Sequel::Model(:sections)
  plugin :timestamps, :update_on_create => true
  plugin :many_through_many

  include Length
  include StartYear
  include FeatureBackup

  many_to_many :lines, join_table: :section_lines
  many_to_one :city
  many_through_many :systems, [[:section_lines, :section_id, :line_id], [:lines, :id, :system_id]] do |ds|
    ds.distinct(:id)
  end

  plugin :geometry

  # This method is used with the raw json that comes from the Editor
  def self.valid_geometry?(geom)
    coords = geom[:coordinates]
    type = geom[:type]
    if type == 'LineString'
      valid_linestring?(coords)
    elsif type == 'MultiLineString'
      coords.all?{|el| valid_linestring?(el)}
    end
  end

  def before_save
    super

    if changed_columns.include?(:geometry)
      self.set_length(self.geometry)
    end
  end
end
