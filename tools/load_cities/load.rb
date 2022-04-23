require_relative "../../api/config/boot.rb"
require "csv"

CSV.parse(ARGF.read, headers:true, header_converters: :symbol) do |row|
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
                      start_year: 2017)

  new_city.set_coords(lat,lon)
  new_city.generate_url_name
  new_city.save

  puts "#{city}, #{state}, #{country} created"
end

