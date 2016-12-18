require './api/config/boot'
require 'sinatra/asset_pipeline/task'
require './api/app/controllers/app'

Sinatra::AssetPipeline::Task.define! App

desc "Run database migrations"
namespace :db do
    task :migrate do
        require 'sequel/extensions/migration'
        Sequel::Migrator.run(DB, "db/migrations",
                use_transactions: true)
        puts "=> db:migrate executed"
    end
end

task :console do
    require 'pry'
    binding.pry
end
