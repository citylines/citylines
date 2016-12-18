class Api < App
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
