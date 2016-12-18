require 'yaml'

mapbox = {}

begin
    mapbox = YAML::load_file('config/mapbox.yml')
rescue
    mapbox['access_token'] = ENV['MAPBOX_ACCESS_TOKEN'];
    mapbox['style'] = ENV['MAPBOX_STYLE'];
end

MAPBOX_ACCESS_TOKEN = mapbox['access_token']
MAPBOX_STYLE = mapbox['style']
