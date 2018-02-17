class BaseApp < App
  set :public_folder, File.join(APP_ROOT, '..', 'public')
  set :views, File.join(APP_ROOT, 'app', 'views')

  set :assets_paths, %w(../../client/assets)
  set :assets_precompile, %w(bundle.js *.css *.png *.svg)
  set :assets_host, "cdn.citylines.co"

  register Sinatra::AssetPipeline

  get '/robots.txt' do
    "sitemap: #{AWS_HOST}sitemaps/sitemap.xml.gz"
  end

  get '/*' do
    erb :index
  end
end
