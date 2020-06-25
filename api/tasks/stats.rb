include CityHelpers

namespace :stats do
  desc "Update city and system stats"
  task :update do
    puts "> Stats updater"

    time_frame = ENV['TIME_FRAME'] ? ENV['TIME_FRAME'].to_i : 70

    puts "Using time frame of #{time_frame} minutes"

    time_limit = Time.now - time_frame * 60
    city_ids = Section.where{updated_at > time_limit}.select(:city_id).
      union(SectionLine.where{updated_at > time_limit}.select(:city_id)).
      union(Line.where{updated_at > time_limit}.select(:city_id)).
      union(DeletedFeature.where(feature_class: 'Section').where{created_at > time_limit}.select(:city_id)).
      distinct(:city_id).all.map(&:city_id)

    puts "#{city_ids.count} cities to update"

    city_ids.each do |city_id|
      city = City[city_id]

      puts "Updating #{city.name} [#{city_id}]"

      city.systems.map do |system|
        system.length = system_length(system)
        system.save
      end

      city.length = city_length(city)
      city.contributors = city_contributors(city)
      city.save
    end
  end
end
