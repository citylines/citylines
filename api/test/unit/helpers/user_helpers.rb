require File.expand_path '../../../test_config', __FILE__

describe UserHelpers do
  include UserHelpers

  before do
    @user_id = 1
    @user2_id = 2

    @city = City.create(name: 'La Plata', url_name: 'la-plata', system_name:'', coords: Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)"))
    @city2 = City.create(name: 'Comodoro Rivadavia', url_name: 'comodoro-rivadavia', system_name:'', coords: Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)"))
    @city3 = City.create(name: 'Berazategui', url_name: 'berazategui', system_name:'', coords: Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)"))
    @city4 = City.create(name: 'Chivilcoy', url_name: 'chivilcoy', system_name:'', coords: Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)"))

    section = Section.create(line_id: 666, length: 3450, geometry: Sequel.lit("ST_GeomFromText('LINESTRING(-71.160281 42.258729,-71.160837 42.259113,-71.161144 42.25932)',4326)"))

    # Created features in city 1
    CreatedFeature.create(feature_class: 'Section', feature_id: section.id, user_id: @user_id, city_id: @city.id)
    CreatedFeature.create(feature_class: 'Station', feature_id: 330, user_id: @user_id, city_id: @city.id)

    # Modified features in city 2
    ModifiedFeatureProps.create(feature_class: 'Section', feature_id: 331, user_id: @user_id, city_id: @city2.id)
    ModifiedFeatureProps.create(feature_class: 'Station', feature_id: 332, user_id: @user_id, city_id: @city2.id)

    ModifiedFeatureGeo.create(feature_class: 'Section', feature_id: 331, user_id: @user_id, city_id: @city2.id)
    ModifiedFeatureGeo.create(feature_class: 'Station', feature_id: 332, user_id: @user_id, city_id: @city2.id)
    ModifiedFeatureGeo.create(feature_class: 'Station', feature_id: 333, user_id: @user_id, city_id: @city2.id)

    # Deleted features in city 3
    DeletedFeature.create(feature_class: 'Station', feature_id: 334, user_id: @user_id, city_id: @city3.id)

    # Modified features in city 4, by other user
    ModifiedFeatureProps.create(feature_class: 'Station', feature_id: 501, user_id: @user2_id, city_id: @city4.id)

    @cities = user_cities(@user_id)
  end

  it "should return only the cities modified by the user" do
    assert_equal 3, @cities.count
  end

  it "should order the cities by length and number of modified/deleted features" do
    assert_equal ['La Plata', 'Comodoro Rivadavia', 'Berazategui'], @cities.map{|c| c[:city][:name]}
    assert_equal ['la-plata', 'comodoro-rivadavia', 'berazategui'], @cities.map{|c| c[:city][:url_name]}
  end

  it "should include the created features" do
    refute @cities[1][:created_features]
    refute @cities[2][:created_features]

    created_features = @cities.first[:created_features]

    assert created_features
    assert_equal 1, created_features[:section_count]
    assert_equal 3.45, created_features[:section_length]
    assert_equal 1, created_features[:station_count]
  end

  it "should include uniq modified features by props and geo" do
    refute @cities[0][:modified_features]
    refute @cities[2][:modified_features]

    modified_features = @cities[1][:modified_features]

    assert_equal 1, modified_features[:section_count]
    assert_equal 2, modified_features[:station_count]
  end

  it "should include the deleted features" do
    refute @cities[0][:deleted_features]
    refute @cities[1][:deleted_features]

    deleted_features = @cities.last[:deleted_features]

    assert_equal 1, deleted_features[:station_count]
  end
end
