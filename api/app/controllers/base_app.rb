require 'xml-sitemap'

class BaseApp < App
  set :public_folder, File.join(APP_ROOT, '..', 'public')
  set :views, File.join(APP_ROOT, 'app', 'views')

  set :assets_paths, %w(../../client/assets)
  set :assets_precompile, %w(bundle.js *.css *.png *.svg)
  set :assets_host, "cdn.citylines.co"

  register Sinatra::AssetPipeline

  get '/robots.txt' do
    "sitemap: http://citylines.co/sitemap.xml"
  end

  get '/sitemap.xml' do
    map = XmlSitemap::Map.new("citylines.co") do |m|
      m.add "data"
      m.add "terms"

      City.all.map do |city|
        m.add city.url_name
      end
    end

    map.render
  end

  get '/*' do
    erb :index
  end
end
