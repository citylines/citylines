require 'yaml'

config = {}

begin
    config = YAML::load_file('api/config/database.yml')
rescue
    config['username'] = ENV['DB_USERNAME'];
    config['password'] = ENV['DB_PASSWORD'];
    config['host'] = ENV['DB_HOST'];
    config['port'] = ENV['DB_PORT'];
    config['database'] = ENV['DB_NAME'];
end

connection = "postgres://#{config['username']}:#{config['password']}@#{config['host']}:#{config['port']}/#{config['database']}"

DB = Sequel.connect(connection)

DB.extension :pg_json
