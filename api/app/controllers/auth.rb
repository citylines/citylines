class Auth < Api
  post '/' do
    body = JSON.parse request.body.read
    email = body['email']
    password = body['password']

    user = User.authenticate(email, password)

    {token: token(user.id),
     username: user.name}.to_json
  end
end
