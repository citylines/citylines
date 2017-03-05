require_relative "../../api/config/boot.rb"
require "csv"

filename = ENV['FILENAME']

CSV.foreach(filename, headers:true, header_converters: :symbol) do |row|
  city = row[:city].strip
  country = row[:country].strip
  state = row[:state] && row[:state] != '' ? row[:state].strip : nil
  lat = row[:lat].to_f
  lon = row[:lon].to_f

  if (state && City[name: city, country_state: state, country: country]) ||
    (!state && City[name: city, country: country])
    puts "#{city}, #{state}, #{country} already exists, skipping"
    next
  end

  new_city = City.new(name: city,
                      country_state: state,
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

  puts "#{city}, #{state}, #{country} created"
end

