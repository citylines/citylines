require 'rack/ssl-enforcer'

class BaseApp < App
  use Rack::SslEnforcer, only_environments: 'production'

  set :public_folder, File.join(APP_ROOT, '..', 'public')
  set :views, File.join(APP_ROOT, 'app', 'views')

  set :assets_paths, %w(../../client/assets)
  set :assets_precompile, %w(*.css *.png *.svg)
  set :assets_host, "cdn.citylines.co"
  set :assets_protocol, :https

  register Sinatra::AssetPipeline

  helpers I18nHelpers
  helpers WebpackHelpers
  helpers SEOHelpers

  get '/robots.txt' do
    "Sitemap: #{AWS_HOST}sitemaps/sitemap.xml.gz"
  end

  # Pre-render title and description
  get '/:url_name' do |url_name|
    @locale = set_locale(params, request)
    @i18n = all_translations

    @city = City[url_name: url_name]

    @title, @description = if @city
                             city_title_and_description(@city)
                           else
                             title_and_description
                           end

    erb :index
  end

  get '/*' do
    @locale = set_locale(params, request)
    @i18n = all_translations

    @title, @description = title_and_description

    erb :index
  end
end
