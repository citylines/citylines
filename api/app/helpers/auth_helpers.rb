require 'jwt'

class MissingTokenCookieError < StandardError
end

def token(user_id)
  JWT.encode payload(user_id), JWT_SECRET, 'HS256'
end

def payload(user_id)
  one_week = 60 * 60 * 24 * 7

  {
    exp: Time.now.to_i + one_week,
    iat: Time.now.to_i,
    user: {
      user_id: user_id
    }
  }
end

def token_cookie_name
  "citylines_token"
end

def protect
  begin
    options = {algorithm: 'HS256'}
    cookie = request.cookies[token_cookie_name]

    unless cookie
      raise MissingTokenCookieError
    end

    payload, header = JWT.decode cookie, JWT_SECRET, true, options

  rescue MissingTokenCookieError
    halt 403, {'Content-Type' => 'application/json'}, {msg: 'Token missing'}.to_json
  rescue JWT::DecodeError
    halt 401, {'Content-Type' => 'application/json'}, {msg: 'A valid token must be passed'}.to_json
  rescue JWT::ExpiredSignature
    halt 403, {'Content-Type' => 'application/json'}, {msg: 'The token has expired'}.to_json
  rescue JWT::InvalidIatError
    halt 403, {'Content-Type' => 'application/json'}, {msg: 'The token does not have a valid "issued at" time'}.to_json
  end
end
