class Station < Sequel::Model(:stations)
  plugin :timestamps, :update_on_create => true

  include StartYear
  include FeatureBackup

  many_to_one :line
  many_to_one :city

  plugin :geometry

  def feature
    h = super

    closure = self.closure || Section::FUTURE

    h[:properties].merge!({line:self.line.name,
                           line_url_name: self.line.url_name,
                           system: self.line.system.name || '',
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
