if ENV['JWT_SECRET'] && ENV['GOOGLE_CLIENT_ID']
  JWT_SECRET = ENV['JWT_SECRET']
  GOOGLE_CLIENT_ID = ENV['GOOGLE_CLIENT_ID']
else
  require 'yaml'
  yml = YAML::load_file('api/config/auth.yml')
  JWT_SECRET = yml['secret']
  GOOGLE_CLIENT_ID = yml['google_client_id']
end
