require File.join(File.dirname(__FILE__), "api", "config", "boot")
require File.join(File.dirname(__FILE__), "api", "app", "controllers", "app")
require File.join(File.dirname(__FILE__), "api", "app", "controllers", "api")
require File.join(File.dirname(__FILE__), "api", "app", "controllers", "auth")

map "/" do
  run App.new
end

map "/api" do
  run Api.new
end

map "/api/auth" do
  run Auth.new
end
