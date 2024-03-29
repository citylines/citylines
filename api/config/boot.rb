unless defined?(APP_ENV)
  APP_ENV = ENV['RACK_ENV'] || 'development'
end

APP_ROOT = File.expand_path('../..', __FILE__)

require 'oj'
Oj.default_options = {mode: :compat}

require 'sequel'
require 'sinatra'
require 'sinatra/asset_pipeline'

require_relative 'cdn'
require_relative 'aws'
require_relative 'database'
require_relative 'mapbox'
require_relative 'auth'
require_relative 'cache'
require_relative 'i18n'
require_relative 'webpack'

Dir[File.join(APP_ROOT, "lib", "**/*.rb")].each {|file| require file}
Dir[File.join(APP_ROOT, "app", "helpers", "*.rb")].each {|file| require file}
Dir[File.join(APP_ROOT, "app", "models", "*.rb")].each {|file| require file}
