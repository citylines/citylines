require 'naturally'

module CityHelpers
  def city_lines(city)
    lines = city.lines.map { |line|
      { name: line.name,
        url_name: line.url_name,
        color: line.color,
        deletable: Section.where(line_id: line.id).count == 0 && Station.where(line_id: line.id).count == 0}
    }

    Naturally.sort_by(lines){|line| line[:name]}
  end

  def lines_length_by_year(city)
    lengths = {}
    years_range = (city.start_year..DateTime.now.year)
    line_ids = Line.where(city_id: city.id).select_map(:id)
    Section.where(line_id: line_ids).each do |section|
      years_range.each do |year|
        lengths[year] ||= {}
        line = section.line.url_name
        if section.buildstart && section.buildstart.to_i <= year && (!section.opening || section.opening.to_i > year)
          lengths[year][line] ||= {}
          lengths[year][line][:under_construction] ||= 0
          lengths[year][line][:under_construction] += section.length
        elsif section.opening && section.opening.to_i <= year && (!section.closure || section.closure.to_i > year)
          lengths[year][line] ||= {}
          lengths[year][line][:operative] ||= 0
          lengths[year][line][:operative] += section.length
        end
      end
    end
    lengths
  end

  def lines_features_collection(city, type)
    city_lines_ids = city.lines.map(&:id)
    query = {line_id: city_lines_ids}

    features = if type == 'sections'
                 Section.where(query).map(&:feature)
               else
                 Station.where(query).map(&:feature)
               end

    {type: "FeatureCollection",
     features: features}
  end

  def all_features_collection(city)
    features_collection = lines_features_collection(city, 'sections').clone
    features_collection[:features] += lines_features_collection(city, 'stations')[:features]
    features_collection
  end

  def update_feature_properties(feature, properties)
    line_id = Line[url_name: properties[:line_url_name]].id
    feature.line_id = line_id
    feature.buildstart = properties[:buildstart]
    feature.opening = properties[:opening]
    feature.closure = properties[:closure]
    feature.name = properties[:name] if feature.is_a?(Station)
    feature.save
  end

  def update_feature_geometry(feature, geometry)
    feature.set_geometry_from_geojson(geometry)
    feature.save
    # Some logging
    puts "Update feature geometry log:"
    puts feature
    puts "feature class #{feature.class}"
    #
    feature.reload
    feature.set_length if feature.is_a?(Section)
    feature.save
  end

  def update_create_or_delete_feature(user, change)
    klass = Object.const_get(change[:klass])

    if change[:created]
      new_feature = klass.new
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
end
