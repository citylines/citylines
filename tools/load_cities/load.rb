require_relative "../../api/config/boot.rb"
require "csv"

CSV.foreach("tools/load_cities/infoplease_cities_formatted.csv", headers:true, header_converters: :symbol) do |row|
  city = row[:city].strip
  country = row[:country].strip
  lat = row[:lat].to_f
  lon = row[:lon].to_f

  if City[name: city, country: country]
    puts "#{city}, #{country} already exists, skipping"
    next
  end

  new_city = City.new(name: city,
                      country: country,
                      system_name: '',
                      start_year: 2017,
                      style: {"line"=>
                                {"hover"=>{"line-color"=>"#000", "line-width"=>7, "line-opacity"=>0.4},
                                    "buildstart"=>{"color"=>"#A4A4A4", "line-width"=>7},
                                       "opening"=> {"default"=>{"line-width"=>7}}},
                                 "station"=>
                                  {"hover"=>{"circle-radius"=>7, "circle-color"=>"#000", "circle-opacity"=>0.4},
                                      "buildstart"=>{"circle-radius"=>7, "color"=>"#A4A4A4", "fillColor"=>"#E6E6E6"},
                                         "opening"=>{"circle-radius"=>7, "fillColor"=>"#E6E6E6"},
                                            "project"=>{"circle-radius"=>7, "fillColor"=>"#E6E6E6"}}}
                     )

  new_city.set_coords(lat,lon)
  new_city.generate_url_name
  new_city.save

  puts "#{city}, #{country} created"
end

