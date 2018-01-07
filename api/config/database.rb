require 'yaml'

connection = ENV['DATABASE_URL']

unless connection
  yaml = YAML::load_file('api/config/database.yml')
  config = yaml[APP_ENV]
  connection = "postgres://#{config['username']}:#{config['password']}@#{config['host']}:#{config['port']}/#{config['database']}"
end

DB = Sequel.connect(connection)

DB.extension :pg_json

Sequel::Model.plugin :tactical_eager_loading
