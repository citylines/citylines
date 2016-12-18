require 'json'

class City < Sequel::Model(:cities)
    one_to_many :lines
    one_to_many :plans

    plugin :geometry

    def set_coords(lat,lon)
        self.coords = self.wkt("POINT(#{lon} #{lat})")
    end

    def geojson_coords
        point = self.geojson_geometry(:coords)
        JSON.parse(point, :symbolize_names => true)[:coordinates]
    end

    def generate_url_name
        self.url_name = self.name.gsub(' ','-').downcase
    end

    def url
        "/#{self.url_name}"
    end
end
