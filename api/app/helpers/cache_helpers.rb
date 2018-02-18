module CacheHelpers
  def last_modified_city_date
    [Section.max(:updated_at), DeletedFeature.where(feature_class: 'Section').max(:created_at), System.max(:updated_at), City.max(:updated_at)].compact.max
  end

  def last_modified_source_feature(city, type)
    klass_name = type == 'sections' ? 'Section' : 'Station'

    [
      features_query(city, type).max(:updated_at),
      feature_lines_query(city, type).max(:updated_at),
      DeletedFeature.where(feature_class: klass_name, city_id: city.id).max(:created_at)
    ].compact.max
  end

  def last_modified_system_or_line(city)
    # SystemBack and LineBackup are added to catch
    # removed systems or lines. There is overlap regarding modified elements.
    [
      System.where(city_id: city.id).max(:updated_at),
      Line.where(city_id: city.id).max(:updated_at),
      SystemBackup.where(city_id: city.id).max(:created_at),
      LineBackup.where(city_id: city.id).max(:created_at)
    ].compact.max
  end
end
