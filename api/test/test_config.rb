require "rack/test"
require "minitest/autorun"
require "database_cleaner"
require "mocha/mini_test"

APP_ENV = 'test'

require File.expand_path "../../config/boot", __FILE__

def logger
  Logger.new(nil)
end

class Minitest::Spec
  before do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.start
  end

  after do
    DatabaseCleaner.clean
  end
end
