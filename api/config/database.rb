require 'yaml'

connection = ENV['DATABASE_URL']

unless connection
  config = YAML::load_file('api/config/database.yml')
  connection = "postgres://#{config['username']}:#{config['password']}@#{config['host']}:#{config['port']}/#{config['database']}"
end

DB = Sequel.connect(connection)

DB.extension :pg_json
