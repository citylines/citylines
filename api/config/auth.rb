if ENV['JWT_SECRET']
  JWT_SECRET = ENV['JWT_SECRET']
else
  require 'yaml'
  jwt = YAML::load_file('api/config/auth.yml')
  JWT_SECRET = jwt['secret']
end
