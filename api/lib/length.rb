module Length
    def set_length
        self.length = calculate_length
    end

    def calculate_length
      if city.srid
        Sequel.lit("ST_Length(ST_Transform(geometry, #{city.srid}))::int")
      else
        Sequel.lit(%q(ST_LengthSpheroid(geometry, 'SPHEROID["GRS_1980",6378137,298.257222101]')::int))
      end
    end
end
