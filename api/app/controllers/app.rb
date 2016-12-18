class App < Sinatra::Base
  DEFAULT_ZOOM = 12
  DEFAULT_BEARING = 0
  DEFAULT_PITCH = 0
  DEFAULT_SPEED = 1

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
