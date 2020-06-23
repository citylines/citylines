require 'json'
require 'accentless'

class City < Sequel::Model(:cities)
    using Accentless
    include CityHelpers

    one_to_many :lines
    one_to_many :systems

    plugin :timestamps, :update_on_create => true
    plugin :geometry

    def set_coords(lat,lon)
        self.coords = self.wkt("POINT(#{lon} #{lat})")
    end

    def geojson_coords
        point = self.geojson_geometry(:coords)
        JSON.parse(point, :symbolize_names => true)[:coordinates]
    end

    def generate_url_name
      return if self.url_name

      new_url_name = self.name.accentless.gsub(' ','-').downcase

      if City[url_name: new_url_name]
        new_url_name = "#{new_url_name}-#{self.country.accentless.gsub(' ', '-').downcase}"
      end

      self.url_name = new_url_name
    end

    def url
        "/#{self.url_name}"
    end

    def before_save
      if self.start_year.nil?
        self.start_year = Time.now.year
      end
    end

    def generate_length_and_contributors
      self.length = city_length(self)
      self.contributors = city_contributors(self)
    end
end
