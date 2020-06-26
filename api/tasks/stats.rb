include CityHelpers

namespace :stats do
  desc "Update city and system stats"
  task :update do
    puts "--> Stats updater"

    time_frame = ENV['TIME_FRAME'] ? ENV['TIME_FRAME'].to_i : 70

    puts "=> Using time frame of #{time_frame} minutes"

    time_limit = Time.now - time_frame * 60
    cities = Section.where{updated_at > time_limit}.select(:city_id).
      union(Line.where{updated_at > time_limit}.select(:city_id)).
      union(DeletedFeature.where(feature_class: 'Section').where{created_at > time_limit}.select(:city_id)).
      distinct(:city_id).all.map(&:city)

    # Note: we don't have to check for modified or removed section_lines, because the Editor updates the feature 
    # when changing lines.

    puts "=> #{cities.count} cities to update"

    DB.transaction do
      cities.each do |city|
        puts "=> Updating #{city.name} [#{city.id}]"

        city.systems.each do |system|
          system.length = system_length(system)
          system.contributors = system_contributors(system)
          system.save
        end

        city.length = city_length(city)
        city.contributors = city_contributors(city)
        city.save
      end
    end
  end
end
