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

    exp = payload['exp']
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
                        expires: Time.at(exp),
                        httponly: true)

    {username: user.name,
     msg: "Login succesful"}.to_json
  end

  get '/check' do
    payload, header = protect

    user = payload['user']

    {username: User[user['user_id']].name,
     msg: "User fetched succesfully"}.to_json
  end

  get '/google_client_id' do
    {google_client_id: GOOGLE_CLIENT_ID}.to_json
  end
end
