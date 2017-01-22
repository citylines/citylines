class Api < App
  DEFAULT_ZOOM = 12
  DEFAULT_BEARING = 0
  DEFAULT_PITCH = 0
  DEFAULT_SPEED = 1

  get '/cities' do
    cities = City.map do |city|
      {name: city.name,
       start_year: city.start_year,
       lines_count: city.lines.count,
       plans_count: city.plans.count,
       url: city.url}
    end
    {cities: cities}.to_json
  end

  get '/:url_name' do |url_name|
    @city = City[url_name: url_name]
    config = {
      mapbox_access_token: MAPBOX_ACCESS_TOKEN,
      mapbox_style: MAPBOX_STYLE,
      coords: @city.geojson_coords,
      zoom: DEFAULT_ZOOM,
      bearing: DEFAULT_BEARING,
      pitch: DEFAULT_PITCH,
      speed: DEFAULT_SPEED,
      years: { start: @city.start_year,
               end: Date.today.year,
               current: nil,
               previous: nil,
               default: nil
      }
    }

    { name: @city.name,
      style: @city.style,
      lines: city_lines(@city),
      lines_length_by_year: lines_length_by_year(@city),
      config: config }.to_json
  end

  get '/:url_name/plan/' do |url_name|
    @city = City[url_name: url_name]
    plan_lines = params[:plan_lines].split(',')
    plan_ids = Plan.where(city_id: @city.id).select_map(:id)
    PlanLine.where(plan_id: plan_ids, parent_url_name: plan_lines).map{ |line|
      {line: line.feature, stations: line.plan_stations.map(&:feature)}
    }.to_json
  end

  get '/:url_name/source/:type' do |url_name, type|
    @city = City[url_name: url_name]
    lines_features_collection(@city, type).to_json
  end
end
