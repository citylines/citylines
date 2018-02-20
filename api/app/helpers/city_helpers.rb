require 'naturally'

module CityHelpers
  def city_lines(city)
    lines = city.lines.map { |line|
      {
        name: line.name,
        url_name: line.url_name,
        color: line.color,
        deletable: SectionLine.where(line_id: line.id).count == 0 && StationLine.where(line_id: line.id).count == 0,
        system_id: line.system_id,
        system_url_name: line.system.url_name
      }
    }

    Naturally.sort_by(lines){|line| line[:name]}
  end

  def city_systems(city)
    systems = @city.systems.map{|system| {id: system.id, name: system.name}}
    Naturally.sort_by(systems){|system| system[:name]}
  end

  def lines_length_by_year(city)
    lengths = {}
    years_range = (city.start_year..DateTime.now.year)

    Section.where(city_id: city.id).each do |section|
      years_range.each do |year|
        lengths[year] ||= {}
        if section.buildstart && section.buildstart.to_i <= year && (!section.opening || section.opening.to_i > year)
          lengths[year][section.id] ||= {
            lines: section.lines.map(&:url_name)
          }
          lengths[year][section.id][:under_construction] = section.length
        elsif section.opening && section.opening.to_i <= year && (!section.closure || section.closure.to_i > year)
          lengths[year][section.id] ||= {
            lines: section.lines.map(&:url_name)
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

  def formatted_lines_features_collection(city, type)
    features = features_query(city, type).all.map(&:formatted_feature).flatten

    {type: "FeatureCollection",
     features: features}
  end

  def lines_features_collection(city, type)
    features = features_query(city, type).all.map(&:raw_feature)

    {type: "FeatureCollection",
     features: features}
  end

  def update_feature_lines(feature, properties)
    current_lines = feature.lines.map(&:url_name)
    updated_lines = properties[:lines].map{|l| l[:line_url_name]}

    lines_to_remove = current_lines - updated_lines
    lines_to_add = updated_lines - current_lines

    unless feature.id
      feature.save
    end

    # Remove
    lines_to_remove.map do |url_name|
      Line[url_name: url_name].remove_from_feature(feature)
    end

    # Add
    lines_to_add.map do |url_name|
      Line[url_name: url_name].add_to_feature(feature)
    end
  end

  def remove_lines_from_feature(feature)
    if feature.is_a?(Section)
      SectionLine.where(section_id: feature.id).map(&:delete)
    else
      StationLine.where(station_id: feature.id).map(&:delete)
    end
  end

  def update_feature_properties(feature, properties)
    update_feature_lines(feature, properties)

    feature.buildstart = properties[:buildstart]
    feature.opening = properties[:opening]
    feature.closure = properties[:closure]
    feature.name = properties[:name] if feature.is_a?(Station)

    # osm properties
    feature.osm_tags = properties[:osm_tags]
    feature.osm_id = properties[:osm_id]

    feature.save
  end

  def update_feature_geometry(feature, geometry)
    feature.set_geometry_from_geojson(geometry)
    feature.save

    if feature.is_a?(Section)
      feature.set_length
      feature.save
    end
  end

  def update_create_or_delete_feature(city, user, change)
    klass = Object.const_get(change[:klass])

    if change[:created]
      new_feature = klass.new(city_id: city.id)
      update_feature_properties(new_feature, change[:feature][:properties])
      update_feature_geometry(new_feature.reload, change[:feature][:geometry])
      CreatedFeature.push(user, new_feature.reload)
      return
    end

    id = change[:id]
    feature = klass[id]

    feature.backup!

    puts "Feature to modify #{klass}:#{id} = #{feature}"
    puts change.inspect

    if change[:removed]
      remove_lines_from_feature(feature)
      DeletedFeature.push(user, feature)
      feature.delete
      return
    end

    if change[:props]
      update_feature_properties(feature, change[:feature][:properties])
      ModifiedFeatureProps.push(user, feature)
    end

    if change[:geo]
      update_feature_geometry(feature, change[:feature][:geometry])
      ModifiedFeatureGeo.push(user, feature)
    end
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
    query = %{
      select sum(length), city_id from sections where
        (sections.opening is not null or sections.opening <= 2017) and (sections.closure is null or sections.closure > 2017)
      group by city_id}

    cities = {}

    DB.fetch(query).each do |register|
      cities[register[:city_id]] = (register[:sum] / 1000).to_i
    end

    cities
  end
end
