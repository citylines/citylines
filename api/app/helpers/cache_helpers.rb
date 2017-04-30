module CacheHelpers
  def last_modified_city_date
    [Section.max(:updated_at), DeletedFeature.where(feature_class: 'Section').max(:created_at), System.max(:updated_at)].compact.max
  end

  def last_modified_source_feature(city, type)
    klass_name = type == 'sections' ? 'Section' : 'Station'

    [features_query(city, type).max(:updated_at), DeletedFeature.where(feature_class: klass_name, city_id: city.id).max(:created_at)].compact.max
  end
end
