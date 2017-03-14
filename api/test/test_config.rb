require "rack/test"
require "minitest/autorun"
require "database_cleaner"

APP_ENV = 'test'

require File.expand_path "../../config/boot", __FILE__

class Minitest::Spec
  before do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.start
  end

  after do
    DatabaseCleaner.clean
  end
end
