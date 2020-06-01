require_relative "../../api/config/boot.rb"
require "csv"

filename = APP_ROOT + '/../tools/load_cities/china_coordinates.csv'

# Already loaded
to_exclude=["Beijing", "Chongqing", "Guangzhou", "Hong Kong", "Macau", "Nanjing", "Shanghai"]

csv = CSV.read(filename, encoding: 'utf-8', headers: true, header_converters: :symbol).map(&:to_h)

cities = csv.reject do |row|
  to_exclude.include?(row[:city])
end.sort_by{|city| city[:population].to_f}.reverse.first(30).sort_by{|c| c[:city]}

cities.map do |city|
  name = city[:city].strip
  country = city[:country].strip
  state = city[:admin] && city[:admin] != '' ? city[:admin].strip : nil
  lat = city[:lat].to_f
  lon = city[:lng].to_f

  if (state && City[name: name, country_state: state, country: country]) ||
    (!state && City[name: name, country: country])
    puts "#{name}, #{state}, #{country} already exists, skipping"
    next
  end

  new_city = City.new(name: name,
                      country_state: state,
                      country: country,
                      start_year: Time.now.year)

  new_city.set_coords(lat,lon)
  new_city.generate_url_name
  new_city.save

  puts "#{name}, #{state}, #{country} created"
end

