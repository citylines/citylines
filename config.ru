require File.join(File.dirname(__FILE__), "api", "config", "boot")
require File.join(File.dirname(__FILE__), "api", "config", "app")
require File.join(File.dirname(__FILE__), "api", "app", "controllers", "base_app")
require File.join(File.dirname(__FILE__), "api", "app", "controllers", "api")
require File.join(File.dirname(__FILE__), "api", "app", "controllers", "auth")
require File.join(File.dirname(__FILE__), "api", "app", "controllers", "data_app")

$stdout.sync = true

map "/" do
  run BaseApp.new
end

map "/api" do
  run Api.new
end

map "/api/auth" do
  run Auth.new
end

map "/api/data" do
  run DataApp.new
end
