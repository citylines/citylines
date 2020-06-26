module Length
    def set_length(geom = 'geometry')
      self.length = if city.srid
                      Sequel.lit("ST_Length(ST_Transform(#{geom}, #{city.srid}))::int")
                    else
                      Sequel.lit(%Q(ST_LengthSpheroid(#{geom}, 'SPHEROID["GRS_1980",6378137,298.257222101]')::int))
                    end
    end
end
