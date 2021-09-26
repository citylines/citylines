class Section < Sequel::Model(:sections)
  plugin :timestamps, :update_on_create => true

  include Length
  include StartYear
  include FeatureBackup

  many_to_many :lines, join_table: :section_lines
  one_to_many :section_lines, order: :id
  many_to_one :city

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
    if changed_columns.include?(:geometry)
      self.set_length(self.geometry)
    end

    super
  end

  def before_destroy
    self.section_lines.map(&:destroy)
    super
  end
end
