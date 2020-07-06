require "sinatra/namespace"

class Api < App
  register Sinatra::Namespace

  DEFAULT_ZOOM = 11
  DEFAULT_BEARING = 0
  DEFAULT_PITCH = 0
  PAGE_SIZE = 5

  helpers CityHelpers
  helpers UserHelpers
  helpers CacheHelpers

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
      last_modified last_modified_city_or_system

      page = params[:page].blank? ? 1 : params[:page].to_i
      term = params[:term]

      results = if term
                  search_city_or_system_by_term(term, page, PAGE_SIZE)
                else
                  City.dataset.order(Sequel.desc(:length)).
                    paginate(page, PAGE_SIZE).all.map do |city|
                    {name: city.name,
                     state: city.country_state,
                     country: city.country,
                     length: (city.length / 1000).to_i,
                     systems: city.systems.sort_by{|s| s.length}.reverse!.map(&:name).reject{|s| s.nil? || s == ''},
                     contributors_count: city.contributors,
                     url: city.url}
                  end
                end

      Oj.dump({
        cities: results
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
      last_modified last_modified_system

      top_systems = System.order(Sequel.desc(:length)).limit(10).all.map do |system|
        {
          name: system.name,
          url: system.url,
          length: (system.length / 1000).to_i,
          city_name: system.city.name
        }
      end

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
end
