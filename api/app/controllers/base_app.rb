require 'rack/ssl-enforcer'

class BaseApp < App
  use Rack::SslEnforcer, only_environments: ['production', 'staging']

  set :public_folder, File.join(APP_ROOT, '..', 'public')
  set :views, File.join(APP_ROOT, 'app', 'views')

  set :assets_paths, %w(../../client/assets)
  set :assets_precompile, %w(*.css *.png *.svg)
  set :assets_host, CDN_DOMAIN
  set :assets_protocol, :https

  register Sinatra::AssetPipeline

  helpers I18nHelpers
  helpers WebpackHelpers
  helpers SEOHelpers

  before do
    cache_control :no_store
    @locale = set_locale(params, request)
  end

  get '/robots.txt' do
    erb :robots, content_type: "text/plain"
  end

  # Pre-render title and description for Compare
  get '/compare' do
    @title, @description = compare_title_and_description(params)
    @url = canonical_url(request.url, allowed_params = ['cities', 'locale'])

    erb :index
  end

  # Pre-render title and description for Data
  get '/data' do
    @title, @description = data_title_and_description
    @url = canonical_url(request.url, allowed_params = ['locale'])

    erb :index
  end


  # Pre-render title and description for User
  get '/user/:user_id' do |user_id|
    if user = User[user_id]
      @title, @description = user_title_and_description(user)
    end

    @url = canonical_url(request.url, allowed_params = ['locale'])

    erb :index
  end

  # Pre-render title and description for cities and systems
  get '/:url_name' do |url_name|
    @url = canonical_url(request.url, allowed_params = ['system_id', 'locale'])

    @title, @description = if params[:system_id] and system = System[params[:system_id]]
                             system_title_and_description(system)
                           elsif city = City[url_name: url_name]
                             city_title_and_description(city)
                           else
                             title_and_description
                           end

    erb :index
  end

  get '/*' do
    @title, @description = title_and_description
    @url = canonical_url(request.url, allowed_params = ['locale'])

    erb :index
  end
end
