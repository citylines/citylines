class App < Sinatra::Base
  set :public_folder, File.join(APP_ROOT, '..', 'public')
  set :views, File.join(APP_ROOT, 'app', 'views')

  set :assets_paths, %w(../../../client/assets)
  set :assets_precompile, %w(bundle.js *.css *.png)

  register Sinatra::AssetPipeline

  helpers CityHelpers

  get '/*' do
    erb :index
  end
end
