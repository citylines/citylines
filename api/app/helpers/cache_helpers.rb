module CacheHelpers
  def last_modified_city_or_system
      City.select(Sequel.function(:max,:updated_at)).
      union(System.select(Sequel.function(:max,:updated_at)), all: true).
      max(:max)
  end

  def last_modified_system
    System.select(Sequel.function(:max,:updated_at)).first[:max]
  end

  def last_modified_city_date
    Section.select(Sequel.function(:max,:updated_at)).
      union(DeletedFeature.where(feature_class: 'Section').select(Sequel.function(:max,:created_at)), all: true).
      union(System.select(Sequel.function(:max,:updated_at)), all: true).
      union(City.select(Sequel.function(:max,:updated_at)), all: true).
      max(:max)
  end

  def last_modified_years_data(city)
    last_modified_source_feature(city, 'sections').
      union(last_modified_source_feature(city, 'stations'), all: true).
      union(City.where(id: city.id).select(Sequel.function(:max, :updated_at)), all: true).
      max(:max)
  end

  def last_modified_base_data(city)
    last_modified_system_or_line(city).
      union(City.where(id: city.id).select(Sequel.function(:max, :updated_at)), all: true).
      max(:max)
  end

  def last_modified_source(city, type)
    last_modified_source_feature(city, type).
      union(last_modified_system_or_line(city), all: true).
      max(:max)
  end

  private

  def last_modified_source_feature(city, type)
    klass_name = type == 'sections' ? 'Section' : 'Station'

    features_query(city, type).select(Sequel.function(:max, :updated_at)).
      union(feature_lines_query(city, type).select(Sequel.function(:max, :updated_at)), all: true).
      union(DeletedFeature.where(feature_class: klass_name, city_id: city.id).select(Sequel.function(:max, :created_at)), all: true)
  end

  def last_modified_system_or_line(city)
    # SystemBackup and LineBackup are added to catch
    # removed systems or lines. There is overlap regarding modified elements.

    System.where(city_id: city.id).select(Sequel.function(:max, :updated_at)).
      union(Line.where(city_id: city.id).select(Sequel.function(:max, :updated_at)), all: true).
      union(SystemBackup.where(city_id: city.id).select(Sequel.function(:max, :created_at)), all: true).
      union(LineBackup.where(city_id: city.id).select(Sequel.function(:max, :created_at)), all: true)
  end
end
