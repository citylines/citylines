class DataApp < App
  helpers CacheHelpers
  helpers DataHelpers

  use Rack::Cache,
    :verbose     => true,
    :metastore   => CACHE_CLIENT,
    :entitystore => CACHE_CLIENT,
    :private_headers => []

  enable :logging

  before do
    cache_control :no_cache
  end

  get '/:url_name/lines_systems_and_modes' do |url_name|
    @city = City[url_name: url_name]

    halt 404 unless @city

    last_modified last_modified_base_data(@city)

    city_lines_systems_and_modes(@city).to_json
  end
end
