require 'naturally'

module CityHelpers
  def city_lines(city)
    lines = city.lines.map { |line|
      { name: line.name,
        url_name: line.url_name,
        color: line.color,
        deletable: line.sections.count == 0 && line.stations.count == 0,
        system_id: line.system_id,
        transport_mode_id: line.transport_mode_id
      }
    }

    Naturally.sort_by(lines){|line| line[:name]}
  end

  def city_systems(city)
    systems = city.systems.map{|system| {id: system.id, name: system.name}}
    Naturally.sort_by(systems){|system| system[:name]}
  end

  def lines_length_by_year(city)
    lengths = {}

    start_range = city.start_year
    end_range = DateTime.now.year

    Section.where(city_id: city.id).select(:id, :buildstart, :closure, :opening, :length).all.each do |section|
      from = if section.buildstart
               section.buildstart.to_i
             elsif section.opening
               section.opening.to_i
             else
               start_range
             end

      to = if section.closure && section.closure.to_i < end_range
             section.closure.to_i
           else
             end_range
           end

      lines = section.lines.map(&:url_name)

      (from..to).each do |year|
        lengths[year] ||= {}
        if section.buildstart && section.buildstart.to_i <= year && (!section.opening || section.opening.to_i > year)
          lengths[year][section.id] ||= {
            lines: lines
          }
          lengths[year][section.id][:under_construction] = section.length
        elsif section.opening && section.opening.to_i <= year && (!section.closure || section.closure.to_i > year)
          lengths[year][section.id] ||= {
            lines: lines
          }
          lengths[year][section.id][:operative] = section.length
        end
      end
    end
    lengths
  end

  def feature_lines_query(city, type)
    klass = type == 'sections' ? SectionLine : StationLine
    klass.where(city_id: city.id)
  end

  def features_query(city, type)
    klass = type == 'sections' ? Section : Station
    klass.where(city_id: city.id)
  end

  def features_geometry(city, type)
    Hash[
      features_query(city, type).id_and_geojson.map do |el|
        [el[:id], el[:st_asgeojson]]
      end
    ]
  end

  def formatted_lines_features_collection(city, type)
    geoms = features_geometry(city, type)

    features = features_query(city, type).all.map do |el|
      el.formatted_feature(geometry: geoms[el.id])
    end.flatten

    {type: "FeatureCollection",
     features: features}
  end

  def lines_features_collection(city, type)
    geoms = features_geometry(city, type)

    features = features_query(city, type).all.map do |el|
      el.raw_feature(geometry: geoms[el.id])
    end

    {type: "FeatureCollection",
     features: features}
  end

  def contributors
    query = %{
      select city_id, count(user_id) from
        (select distinct city_id, user_id from
          (select city_id, user_id from modified_features_props union
           select city_id, user_id from created_features union
           select city_id, user_id from deleted_features union
           select city_id, user_id from modified_features_geo) as modifications
        ) as different
      group by (city_id)
    }

    cities = {}

    DB.fetch(query).each do |register|
      cities[register[:city_id]] = register[:count]
    end

    cities
  end

  def lengths
    today = Time.now.year

    query = %{
      select sum(length), city_id from sections where
        sections.opening is not null and sections.opening <= #{today} and (sections.closure is null or sections.closure > #{today})
      group by city_id}

    cities = {}

    DB.fetch(query).each do |register|
      cities[register[:city_id]] = (register[:sum] / 1000).to_i
    end

    cities
  end

  def top_systems
    today = Time.now.year

    query = Section.
      left_join(:section_lines, section_id: :id).
      left_join(:lines, id: :line_id).
      left_join(:systems, id: :system_id).
      where{(sections__opening !~ nil) & (sections__opening <= today) & ((sections__closure =~ nil) | (sections__closure > today))}.
      select(:system_id).select_append{sum(:length)}.
      group_by(:system_id).order(Sequel.desc(:sum))

    query.first(10).map do |row|
      system = System[row[:system_id]]
      length = (row[:sum] / 1000).to_i

      {
        name: system.name,
        url: system.url,
        length: length,
        city_name: system.city.name
      }
    end
  end
end
