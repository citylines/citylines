require 'jwt'

def token(user_id)
  JWT.encode payload(user_id), JWT_SECRET, 'HS256'
end

def payload(user_id)
  one_month = 60 * 60 * 24 * 30

  {
    exp: Time.now.to_i + one_month,
    iat: Time.now.to_i,
    user: {
      user_id: user_id
    }
  }
end
