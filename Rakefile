require './api/config/boot'
require 'sinatra/asset_pipeline/task'
require './api/config/app'
require './api/app/controllers/base_app'
require 'rake/testtask'
require 'sitemap_generator/tasks'
Dir["./api/tasks/*.rb"].each {|file| require file }

Sinatra::AssetPipeline::Task.define! BaseApp

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
