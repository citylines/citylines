class Auth < Api
  post '/' do
    body = JSON.parse request.body.read
    email = body['email']
    password = body['password']

    user = User.authenticate(email, password)

    one_month = 60 * 60 * 24 * 30

    response.set_cookie("citylines_token",
                        value: token(user.id),
                        path: '/',
                        expires: Time.now + one_month,
                        httponly: true)

    {username: user.name}.to_json
  end
end
