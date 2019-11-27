require 'google-id-token'
require "sinatra/namespace"

class Auth < App
  register Sinatra::Namespace

  post '/' do
    body = JSON.parse request.body.read

    validator = GoogleIDToken::Validator.new
    required_audience = required_client_id = GOOGLE_CLIENT_ID

    begin
      payload = validator.check(body['token'], required_audience, required_client_id)
    rescue GoogleIDToken::ValidationError => e
      halt "Cannot validate: #{e}"
    end

    name = payload['name']
    email = payload['email']

    user = User[email: email]

    unless user
      user = User.new(name: name, email: email)
      user.save
    end

    reject_if_banned(user)

    response.set_cookie(token_cookie_name,
                        value: token(user.id),
                        path: '/',
                        expires: Time.at(expiration_time),
                        httponly: true)

    {initials: user.initials,
     userid: user.id,
     msg: "Login succesful"}.to_json
  end

  get '/check' do
    payload, header = protect

    user_id = payload['user']['user_id']
    user = User[user_id]

    reject_if_banned(user)

    {initials: user.initials,
     userid: user.id,
     msg: "User fetched succesfully"}.to_json
  end

  get '/google_client_id' do
    {google_client_id: GOOGLE_CLIENT_ID}.to_json
  end

  namespace '/twitter' do
    before do
      require "oauth"

      @consumer = OAuth::Consumer.new(TWITTER_API_KEY, TWITTER_API_SECRET, {site: "https://api.twitter.com", scheme: :header })
    end

    get do
      callback_url = "http://www.citylines.co/api/auth/twitter/callback"

      request_token = @consumer.get_request_token(oauth_callback: callback_url)

      redirect request_token.authorize_url(oauth_callback: callback_url)
    end

    get "/callback" do
      hash = {oauth_token: params[:oauth_token], oauth_token_secret: params[:oauth_verifier]}

      request_token = OAuth::RequestToken.from_hash(@consumer, hash)
      access_token = request_token.get_access_token(oauth_verifier: params[:oauth_verifier])

      res = access_token.get("https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true")
      payload = JSON.parse(res.body, symbolize_names: true)

      name = payload[:name]
      email = payload[:email]
      twitter = payload[:screen_name]

      user = User[email: email]

      if user && !user.twitter
        user.twitter = twitter
        user.save
      end

      unless user
        user = User.new(name: name, email: email, twitter: twitter)
        user.save
      end

      reject_if_banned(user)

      response.set_cookie(token_cookie_name,
                          value: token(user.id),
                          path: '/',
                          expires: Time.at(expiration_time),
                          httponly: true)

      redirect "/user/#{user.id}"
    end
  end
end
