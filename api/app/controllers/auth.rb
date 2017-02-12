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

    user = User.find_or_create(name: name, email: email)

    response.set_cookie(token_cookie_name,
                        value: token(user.id),
                        path: '/',
                        expires: Time.at(exp),
                        httponly: true)

    {username: name,
     msg: "Login succesful"}.to_json
  end
end