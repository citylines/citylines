if ENV['JWT_SECRET']
  JWT_SECRET = ENV['JWT_SECRET']
else
  require 'yaml'
  jwt = YAML::load_file('api/config/jwt.yml')
  JWT_SECRET = jwt['secret']
end
