require 'google-id-token'

class Auth < App
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

    response.set_cookie(token_cookie_name,
                        value: token(user.id),
                        path: '/',
                        expires: Time.at(expiration_time),
                        httponly: true)

    {username: user.name,
     userid: user.id,
     msg: "Login succesful"}.to_json
  end

  get '/check' do
    payload, header = protect

    user_id = payload['user']['user_id']
    user = User[user_id]

    {username: user.name,
     userid: user.id,
     msg: "User fetched succesfully"}.to_json
  end

  get '/google_client_id' do
    {google_client_id: GOOGLE_CLIENT_ID}.to_json
  end
end
