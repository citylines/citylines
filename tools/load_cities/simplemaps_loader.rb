require_relative "../../api/config/boot.rb"
require "csv"

filename = ENV['FILENAME']

CSV.foreach(filename, headers:true, header_converters: :symbol) do |row|
  city = row[:city].strip
  country = row[:country].strip
  lat = row[:lat].to_f
  lon = row[:lng].to_f

  if (City[name: city, country: country])
    puts "#{city}, #{country} already exists, skipping"
    next
  end

  new_city = City.new(name: city,
                      country: country,
                      start_year: 2018)

  new_city.set_coords(lat,lon)
  new_city.generate_url_name
  new_city.save

  puts "#{city}, #{country} created"
end
