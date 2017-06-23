class Section < Sequel::Model(:sections)
  plugin :timestamps, :update_on_create => true

  include Length
  include StartYear
  include FeatureBackup

  many_to_one :line
  many_to_one :city

  plugin :geometry

  FUTURE = 999999

  def feature
    h = super

    closure = self.closure || FUTURE

    h[:properties].merge!({length: self.length,
                           line: self.line.name,
                           line_url_name: self.line.url_name,
                           system: self.line.system.name || '',
                           opening: self.opening || FUTURE,
                           buildstart: self.buildstart || self.opening,
                           buildstart_end: self.opening || closure,
                           osm_id: self.osm_id,
                           osm_tags: self.osm_tags,
                           closure: closure })
    h
  end
end
