class Section < Sequel::Model(:sections)
  plugin :timestamps, :update_on_create => true

  include Length
  include StartYear
  include FeatureBackup

  many_to_one :line

  plugin :geometry

  FUTURE = 999999

  def city
    self.line.city
  end

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
                           closure: closure })
    h
  end
end
