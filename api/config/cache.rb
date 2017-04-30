require 'rack-cache'
require 'dalli'

if server = ENV["MEMCACHIER_SERVERS"]
  username = ENV["MEMCACHIER_USERNAME"]
  password = ENV["MEMCACHIER_PASSWORD"]
else
  server = "127.0.0.1:11211"
  username = nil
  password = nil
end

CACHE_CLIENT = Dalli::Client.new((server || "").split(","),
                           :username => username,
                           :password => password,
                           :failover => true,
                           :compress => true,
                           :socket_timeout => 1.5,
                           :socket_failure_delay => 0.2,
                           :value_max_bytes => 1048576 * 50)

