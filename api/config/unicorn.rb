worker_processes 4
preload_app true

before_fork do |server, worker|
  DB.disconnect
end
