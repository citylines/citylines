require 'yaml'

connection = ENV['DATABASE_URL']

unless connection
  yaml = YAML::load_file('api/config/database.yml')
  config = yaml[APP_ENV]
  connection = "postgres://#{config['username']}:#{config['password']}@#{config['host']}:#{config['port']}/#{config['database']}"
end


DB = Sequel.connect(connection)

tries = 0
begin
  DB.test_connection
rescue => error
  if tries < 5
    STDERR.puts %{
      Could not connect to DB server: Connection refused. Retrying in 5 seconds...
    }
    sleep 5
    tries += 1
    retry
  else
    raise
  end
end

DB.extension :pg_json
DB.extension :pagination

Sequel::Model.plugin :tactical_eager_loading

if APP_ENV == 'development'
  DB.loggers << Logger.new($stdout)
end
