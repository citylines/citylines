require './api/config/boot'
require 'sinatra/asset_pipeline/task'
require './api/config/app'
require './api/app/controllers/base_app'
require 'rake/testtask'
require 'sitemap_generator/tasks'

Sinatra::AssetPipeline::Task.define! BaseApp

namespace :db do
  desc "Run database migrations"
  task :migrate do
    require 'sequel/extensions/migration'
    Sequel::Migrator.run(DB, "api/db/migrations",
                         use_transactions: true)
    puts "=> db:migrate executed"
  end

  desc "Perform migration up/down to VERSION"
  task :to, [:version] do |t, args|
    require 'sequel/extensions/migration'
    version = (args[:version] || ENV['VERSION']).to_s.strip
    raise "No VERSION was provided" if version.empty?
    Sequel::Migrator.run(DB, "api/db/migrations",
                         target: version.to_i,
                         use_transactions: true)
    puts "=> db:to[#{version}] executed"
  end
end

task :console do
    require 'pry'
    binding.pry
end

Rake::TestTask.new do |t|
  t.description = "Run tests"
  t.test_files = FileList['api/test/**/*.rb']
  t.verbose = true
  t.warning = false
end
