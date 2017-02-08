class Auth < App
  post '/' do
    body = JSON.parse request.body.read
    email = body['email']
    password = body['password']

    user = User.authenticate(email, password)

    unless user
      halt 404, {'Content-Type' => 'application/json'}, {msg: 'Email or password is invalid'}.to_json
    end

    one_week = 60 * 60 * 24 * 7

    response.set_cookie(token_cookie_name,
                        value: token(user.id),
                        path: '/',
                        expires: Time.now + one_week,
                        httponly: true)

    {username: user.name,
     msg: "Login succesful"}.to_json
  end
end
