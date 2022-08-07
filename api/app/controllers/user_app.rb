class UserApp < App
  helpers UserHelpers

  use Rack::Cache,
    :verbose     => true,
    :metastore   => CACHE_CLIENT,
    :entitystore => CACHE_CLIENT,
    :private_headers => []

  before do
    cache_control :no_cache
  end

  get '/' do
    user_id = params[:user_id]
    user = User[user_id]

    {
      name: user.nickname,
      img: user.img_url,
      initials: user.initials,
      cities: user_cities(user_id)
    }.to_json
  end

  put '/:user_id/nickname' do |user_id|
    protect

    user = User[user_id]
    args = JSON.parse(request.body.read, symbolize_names: true)
    user.custom_name = args[:nickname]
    user.save

    {
      name: user.nickname,
      initials: user.initials,
    }.to_json
  end

  put '/:user_id/gravatar' do |user_id|
    protect

    user = User[user_id]
    user.set_gravatar_img
    user.save

    {
      img: user.img_url
    }.to_json
  end

  delete '/:user_id/gravatar' do |user_id|
    protect

    user = User[user_id]
    user.img_url = nil
    user.save

    {
      img: nil
    }.to_json
  end
end
