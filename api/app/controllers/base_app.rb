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

  get '/robots.txt' do
    "Sitemap: #{AWS_HOST}sitemaps/sitemap.xml.gz"
  end

  get '/*' do
    @locale = locale_from_params(params) || browser_locale(request) || DEFAULT_LOCALE
    @i18n = LOCALES[@locale]
    erb :index
  end
end
