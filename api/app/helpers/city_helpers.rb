module CityHelpers
  def city_lines(city)
    city.lines.map { |line|
      { name: line.name,
        url_name: line.url_name,
        style: line.style }
    }
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

  def create_feature(change)
    # TODO
  end

  def remove_feature(change)
    # TODO
  end

  def update_create_or_delete_feature(change)
    if change[:removed]
      remove_feature(change[:feature])
    end

    if change[:created]
      create_feature(change[:feature])
    end

    klass = Object.const_get(change[:klass])
    id = change[:id]
    feature = klass[id]

    if change[:geo]
      feature.set_geometry_from_geojson(change[:feature][:geometry])
      feature.set_length if klass == Section
    end

    if change[:props]
      properties = change[:feature][:properties]

      line_id = Line[url_name: properties[:line_url_name]].id
      feature.line_id = line_id
      feature.buildstart = properties[:buildstart]
      feature.opening = properties[:opening]
      feature.closure = properties[:closure]
    end

    feature.save
  end
end
