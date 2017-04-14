module UserHelpers
  def user_cities(user_id)
    h = {}

    CreatedFeature
    .where(user_id: user_id)
    .left_join(:sections, :created_features__feature_class => 'Section', :created_features__feature_id => :sections__id)
    .each do |created_feature|
      city_id = created_feature[:city_id]
      h[city_id] ||= {}
      h[city_id][:created_features] ||= {section_count: 0, section_length: 0, station_count: 0}

      if created_feature[:feature_class] == 'Section'
        # If there is no length it probably means that the feature has been deleted
        next unless created_feature[:length]

        h[city_id][:created_features][:section_count] += 1
        h[city_id][:created_features][:section_length] += created_feature[:length]
      else
        h[city_id][:created_features][:station_count] += 1
      end
    end

    # TODO:
    # - ModifiedFeaturesGeo
    # - ModifiedFeatureProps
    # - Removed Features

    h
  end
end
