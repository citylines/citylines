class EditorApp < App
  helpers CityHelpers
  helpers OSMHelpers
  helpers EditorHelpers

  get '/:url_name/data' do |url_name|
    protect

    @city = City[url_name: url_name]

    { lines: city_lines(@city),
      systems: city_systems(@city),
      transport_modes: TransportMode.summary
    }.to_json
  end

  put '/:url_name/features' do |url_name|
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

  put '/:url_name/line' do |url_name|
    protect

    @city = City[url_name: url_name]
    args = JSON.parse(request.body.read, symbolize_names: true)

    line = Line.where(url_name: args[:line_url_name]).first

    halt if line.city_id != @city.id

    line.backup!
    line.color = args[:color]
    line.name = args[:name]

    new_system = nil
    prev_system = nil

    if args[:system_id] != line.system_id
      prev_system = line.system
      line.system_id = args[:system_id]
      new_system = line.system
    end

    unless args[:transport_mode_id].blank?
      line.transport_mode_id = args[:transport_mode_id]
    end

    line.save

    # We update the systems length in case they changed
    [prev_system, new_system].each do |system|
      next unless system
      system.compute_length
      system.save
    end

    city_lines(@city).to_json
  end

  post '/:url_name/line' do |url_name|
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

  delete '/:url_name/line' do |url_name|
    protect

    @city = City[url_name: url_name]
    args = JSON.parse(request.body.read, symbolize_names: true)

    line = Line.where(url_name: args[:line_url_name]).first

    halt if line.city_id != @city.id

    line.backup!
    line.delete

    city_lines(@city).to_json
  end

  put '/:url_name/system' do |url_name|
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

  post '/:url_name/system' do |url_name|
    protect

    @city = City[url_name: url_name]

    args = JSON.parse(request.body.read, symbolize_names: true)

    system = System.new(city_id: @city.id, name: args[:name])
    system.save

    city_systems(@city).to_json
  end

  delete '/:url_name/system' do |url_name|
    protect

    @city = City[url_name: url_name]

    args = JSON.parse(request.body.read, symbolize_names: true)

    system = System[args[:id]]

    halt if system.city_id != @city.id

    system.backup!
    system.delete

    city_systems(@city).to_json
  end

  get '/:url_name/osm' do |url_name|
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
end
