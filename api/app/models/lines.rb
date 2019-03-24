require 'accentless'

class Line < Sequel::Model(:lines)
  plugin :timestamps, :update_on_create => true
  using Accentless

  include FeatureBackup

  many_to_one :city
  many_to_one :system

  many_to_one :transport_mode

  many_to_many :sections, join_table: :section_lines
  many_to_many :stations, join_table: :station_lines

  def generate_url_name
    self.url_name = "#{self.id}-#{self.name.strip.accentless.gsub(/\s|\//,'-').downcase}"
  end

  def remove_from_feature(feature)
    klass = feature.is_a?(Section) ? SectionLine : StationLine
    attr = feature.is_a?(Section) ? :section_id : :station_id

    klass.where(attr => feature.id, :line_id => id).first.delete
  end

  def add_to_feature(feature)
    klass = feature.is_a?(Section) ? SectionLine : StationLine
    attr = feature.is_a?(Section) ? :section_id : :station_id

    klass.create(attr => feature.id, :line_id => id, city_id: city.id)
  end

  def width
    transport_mode.width
  end

  def min_width
    transport_mode.min_width
  end
end
