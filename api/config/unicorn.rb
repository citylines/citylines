worker_processes 4
preload_app true

app_path = File.expand_path(File.dirname(__FILE__) + "/../../")
working_directory app_path

before_fork do |server, worker|
  DB.disconnect
end
