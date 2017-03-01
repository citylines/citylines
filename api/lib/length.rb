module Length
    def srid
        puts "Length#self: #{self}"
        city.srid || 3857
    end

    def set_length
        self.length = calculate_length
    end

    def calculate_length
        Sequel.lit("ST_Length(ST_Transform(geometry, #{srid}))::int")
    end
end
