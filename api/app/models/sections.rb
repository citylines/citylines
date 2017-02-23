class Section < Sequel::Model(:sections)
  include StartYear

  many_to_one :line

  plugin :geometry

  FUTURE = 999999

  def city
    self.line.city
  end

  def srid
    city.srid || 3857
  end

  def set_length
    self.length = self.calculate_length
  end

  def calculate_length
    Sequel.lit("ST_Length(ST_Transform(geometry, #{self.srid}))::int")
  end

  def feature
    h = super

    closure = self.closure || FUTURE

    h[:properties].merge!({length: self.length,
                           line: self.line.name,
                           line_url_name: self.line.url_name,
                           opening: self.opening || FUTURE,
                           buildstart: self.buildstart || self.opening,
                           buildstart_end: self.opening || closure,
                           closure: closure })
    h
  end
end
