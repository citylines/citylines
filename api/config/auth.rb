if ENV['JWT_SECRET'] && ENV['GOOGLE_CLIENT_ID'] && ENV['TWITTER_API_SECRET']
  JWT_SECRET = ENV['JWT_SECRET']
  GOOGLE_CLIENT_ID = ENV['GOOGLE_CLIENT_ID']
  # TWITTER_API_KEY = ENV['TWITTER_API_KEY']
  # TWITTER_API_SECRET = ENV['TWITTER_API_SECRET']
else
  require 'yaml'
  yml = YAML::load_file('api/config/auth.yml')
  JWT_SECRET = yml['secret']
  GOOGLE_CLIENT_ID = yml['google_client_id']
  # TWITTER_API_KEY = yml['twitter']['api_key']
  # TWITTER_API_SECRET = yml['twitter']['api_secret']
end
