class Station < Sequel::Model(:stations)
  plugin :timestamps, :update_on_create => true

  include StartYear
  include FeatureBackup

  one_to_many :station_lines
  many_to_one :city

  plugin :geometry

  def lines
    @lines ||= station_lines.map(&:line)
  end

  def line_url_name
    lines.count > 1 ? "shared-station" : lines.first.url_name
  end

  def lines_data
    lines.map do |l|
      {name: l.name,
       url_name: l.url_name,
       system_name: l.system.name}
    end
  end

  def feature
    h = super

    closure = self.closure || Section::FUTURE

    h[:properties].merge!({line_url_name: line_url_name,
                           lines: lines_data,
                           name: self.name,
                           opening: self.opening || Section::FUTURE,
                           buildstart: self.buildstart || self.opening,
                           buildstart_end: self.opening || closure,
                           osm_id: self.osm_id,
                           osm_tags: self.osm_tags,
                           closure: closure })
    h
  end

  def raw_feature
    feature
  end

  def formatted_feature
    feature
  end
end
