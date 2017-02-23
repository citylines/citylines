module Length
    def srid
        self.city.srid || 3857
    end

    def set_length
        self.length = self.calculate_length
    end

    def calculate_length
        Sequel.lit("ST_Length(ST_Transform(geometry, #{self.srid}))::int")
    end
end
