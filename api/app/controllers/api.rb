class Api < App
  DEFAULT_ZOOM = 12
  DEFAULT_BEARING = 0
  DEFAULT_PITCH = 0

  get '/cities' do
    cities = City.map do |city|
      {name: city.name,
       lines_count: city.lines.count,
       contributors_count: contributors(city),
       url: city.url}
    end

    {cities: cities}.to_json
  end

  get '/:url_name/config' do |url_name|
    @city = City[url_name: url_name]

    { name: @city.name,
      mapbox_access_token: MAPBOX_ACCESS_TOKEN,
      mapbox_style: MAPBOX_STYLE,
      coords: @city.geojson_coords,
      zoom: DEFAULT_ZOOM,
      bearing: DEFAULT_BEARING,
      pitch: DEFAULT_PITCH }.to_json
  end

  get '/:url_name/view_data' do |url_name|
    @city = City[url_name: url_name]

    { style: @city.style,
      lines: city_lines(@city),
      lines_length_by_year: lines_length_by_year(@city),
      years: { start: @city.start_year,
               end: Date.today.year,
               current: nil,
               previous: nil,
               default: nil }
    }.to_json
  end

  get '/editor/:url_name/data' do |url_name|
    protect

    @city = City[url_name: url_name]

    { features: all_features_collection(@city),
      lines: city_lines(@city)}.to_json
  end

  get '/:url_name/source/:type' do |url_name, type|
    @city = City[url_name: url_name]
    lines_features_collection(@city, type).to_json
  end

  get '/editor/:url_name/features' do |url_name|
    protect

    @city = City[url_name: url_name]
    all_features_collection(@city).to_json
  end

  put '/editor/:url_name/features' do |url_name|
    payload, header = protect
    user = User[payload['user']['user_id']]

    @city = City[url_name: url_name]
    changes = JSON.parse(request.body.read, symbolize_names: true)

    changes.each do |change|
      update_create_or_delete_feature(user, change);
    end

    all_features_collection(@city).to_json
  end

  put '/editor/:url_name/line/:line_url_name' do |url_name, line_url_name|
    protect

    @city = City[url_name: url_name]
    args = JSON.parse(request.body.read, symbolize_names: true)

    @city.style["line"]["opening"][line_url_name]["color"] = args[:color]
    @city.save

    @line = Line.where(city_id: @city.id, url_name: line_url_name).first
    @line.name = args[:name]
    @line.save

    city_lines(@city).to_json
  end

  post '/editor/:url_name/line' do |url_name|
    protect

    @city = City[url_name: url_name]
    args = JSON.parse(request.body.read, symbolize_names: true)

    line = Line.new(city_id: @city.id, name: args[:name])
    line.save
    line.reload.generate_url_name
    line.save

    @city.style["line"]["opening"][line.url_name] = {"color": args[:color]}
    @city.save

    city_lines(@city).to_json
  end

  delete '/editor/:url_name/line/:line_url_name' do |url_name, line_url_name|
    protect

    @city = City[url_name: url_name]

    @city.style["line"]["opening"].delete(line_url_name)
    @city.save

    @line = Line.where(city_id: @city.id, url_name: line_url_name).first
    @line.delete

    city_lines(@city).to_json
  end
end
