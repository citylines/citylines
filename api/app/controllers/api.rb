require "sinatra/namespace"

class Api < App
  register Sinatra::Namespace

  DEFAULT_ZOOM = 11
  DEFAULT_BEARING = 0
  DEFAULT_PITCH = 0

  helpers CityHelpers
  helpers UserHelpers
  helpers CacheHelpers
  helpers OSMHelpers
  helpers EditorHelpers

  use Rack::Cache,
    :verbose     => true,
    :metastore   => CACHE_CLIENT,
    :entitystore => CACHE_CLIENT,
    :private_headers => []

  enable :logging

  before do
    cache_control :no_cache
  end

  namespace '/cities' do
    get '/list' do
      last_modified last_modified_city_date

      contributors_by_city = contributors
      city_length = lengths

      cities = City.all.map do |city|
        {name: city.name,
         state: city.country_state,
         country: city.country,
         length: city_length[city.id] || 0,
         systems: city.systems.map(&:name).reject{|s| s.nil? || s == ''},
         contributors_count: contributors_by_city[city.id] || 0,
         url: city.url}
      end

      Oj.dump({
        cities: cities
      })
    end

    get '/top_contributors' do
      last_modified last_modified_city_date

      {
        top_contributors: top_contributors,
        month_top_contributors: top_contributors(last_month: true)
      }.to_json
    end

    get'/top_systems' do
      last_modified last_modified_city_date

      {
        top_systems: top_systems
      }.to_json
    end
  end

  get '/:url_name/config' do |url_name|
    @city = City[url_name: url_name]

    halt 404 unless @city

    { name: @city.name,
      mapbox_access_token: MAPBOX_ACCESS_TOKEN,
      mapbox_style: MAPBOX_STYLE,
      coords: @city.geojson_coords,
      zoom: DEFAULT_ZOOM,
      bearing: DEFAULT_BEARING,
      pitch: DEFAULT_PITCH }.to_json
  end

  namespace '/:url_name/view' do
    get '/base_data' do |url_name|
      @city = City[url_name: url_name]

      halt 404 unless @city

      last_modified last_modified_base_data(@city)

      Oj.dump({ lines: city_lines(@city),
        systems: city_systems(@city),
        transport_modes: TransportMode.summary,
        years: { start: @city.start_year,
                 end: Date.today.year,
                 current: nil,
                 previous: nil,
                 default: Date.today.year }
      })
    end

    get '/years_data' do |url_name|
      @city = City[url_name: url_name]

      halt 404 unless @city

      last_updated = last_modified_years_data(@city)

      # We add this hack so we have current year's data
      # if the original data is cached
      if last_updated.year < Time.now.year
        last_updated = Time.new(Time.now.year,1,1) + 1
      end

      last_modified last_updated

      Oj.dump(lines_length_by_year(@city))
    end
  end

  get '/:url_name/source/:type' do |url_name, type|
    @city = City[url_name: url_name]

    last_modified last_modified_source(@city, type)

    formatted_lines_features_collection(@city, type)
  end

  get '/:url_name/raw_source/:type' do |url_name, type|
    @city = City[url_name: url_name]

    last_modified last_modified_source(@city, type)

    lines_features_collection(@city, type)
  end

  get '/editor/:url_name/data' do |url_name|
    protect

    @city = City[url_name: url_name]

    { lines: city_lines(@city),
      systems: city_systems(@city),
      transport_modes: TransportMode.summary
    }.to_json
  end

  put '/editor/:url_name/features' do |url_name|
    payload, header = protect
    user = User[payload['user']['user_id']]

    @city = City[url_name: url_name]
    changes = JSON.parse(request.body.read, symbolize_names: true)

    DB.transaction do
      changes.each do |change|
        update_create_or_delete_feature(@city, user, change);
      end
    end

    status 200
  end

  put '/editor/:url_name/line' do |url_name|
    protect

    @city = City[url_name: url_name]
    args = JSON.parse(request.body.read, symbolize_names: true)

    line = Line.where(url_name: args[:line_url_name]).first

    halt if line.city_id != @city.id

    line.backup!
    line.color = args[:color]
    line.name = args[:name]
    line.system_id = args[:system_id]

    unless args[:transport_mode_id].blank?
      line.transport_mode_id = args[:transport_mode_id]
    end

    line.save

    city_lines(@city).to_json
  end

  post '/editor/:url_name/line' do |url_name|
    protect

    @city = City[url_name: url_name]
    args = JSON.parse(request.body.read, symbolize_names: true)

    opts = {city_id: @city.id, name: args[:name], color: args[:color], system_id: args[:system_id]}

    unless args[:transport_mode_id].blank?
      opts.merge!(transport_mode_id: args[:transport_mode_id])
    end

    line = Line.new(opts)
    line.save
    line.reload.generate_url_name
    line.save

    city_lines(@city).to_json
  end

  delete '/editor/:url_name/line' do |url_name|
    protect

    @city = City[url_name: url_name]
    args = JSON.parse(request.body.read, symbolize_names: true)

    line = Line.where(url_name: args[:line_url_name]).first

    halt if line.city_id != @city.id

    line.backup!
    line.delete

    city_lines(@city).to_json
  end

  put '/editor/:url_name/system' do |url_name|
    protect

    @city = City[url_name: url_name]

    args = JSON.parse(request.body.read, symbolize_names: true)

    system = System[args[:id]]

    halt if system.city_id != @city.id

    system.backup!
    system.name = args[:name]
    system.save

    city_systems(@city).to_json
  end

  post '/editor/:url_name/system' do |url_name|
    protect

    @city = City[url_name: url_name]

    args = JSON.parse(request.body.read, symbolize_names: true)

    system = System.new(city_id: @city.id, name: args[:name])
    system.save

    city_systems(@city).to_json
  end

  delete '/editor/:url_name/system' do |url_name|
    protect

    @city = City[url_name: url_name]

    args = JSON.parse(request.body.read, symbolize_names: true)

    system = System[args[:id]]

    halt if system.city_id != @city.id

    system.backup!
    system.delete

    city_systems(@city).to_json
  end

  get '/editor/:url_name/osm' do |url_name|
    protect

    @city = City[url_name: url_name]

    route = params[:route]
    s = params[:s]
    n = params[:n]
    w = params[:w]
    e = params[:e]

    halt unless (route && s && n && w && e)

    get_osm_features_collection(@city, route, s, n, w, e).to_json
  end

  get '/user' do
    user_id = params[:user_id]
    user = User[user_id]

    {
      name: user.name.split(" ")[0],
      cities: user_cities(user_id)
    }.to_json
  end
end
