require File.expand_path '../../../test_config', __FILE__

describe "modified features models" do
  before do
    @city = City.new(name: 'Some city',
                     start_year: 2017,
                     url_name: 'city',
                     country: 'Argentina')

    @city.coords = Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)")
    @city.save

    @user = User.create(name: 'Test User', email: 'test@user.com')

    @feature = Section.create(city_id: @city.id)
  end

  it "should should try to create a models instance" do
    [CreatedFeature, DeletedFeature, ModifiedFeatureGeo, ModifiedFeatureProps].each do |model|
      model.expects(:create).with(
        user_id: @user.id,
        city_id: @city.id,
        feature_class: @feature.class.name,
        feature_id: @feature.id
      )

      model.push(@user, @feature)
    end
  end
end
