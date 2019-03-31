require File.expand_path '../../../test_config', __FILE__

describe City do
  before do
    @city = City.new(name: 'Test Cité',
                     coords: nil,
                     start_year: 2017,
                     country: 'Argentina',
                     country_state: 'San Luis')
    @city.generate_url_name
    @city.save
  end

  it "should return the right url" do
    assert_equal '/test-cite', @city.url
  end

  it "should set and return the right coords" do
    refute @city.coords

    @city.set_coords(-54.807222, -68.304444)
    @city.save

    assert @city.coords

    assert_equal [-68.30444, -54.80722], @city.geojson_coords
  end

  describe "url_name" do
    it "should have the right url_name" do
      assert_equal 'test-cite', @city.url_name
    end

    it "should set a country-dependant url_name if it already exists" do
      new_city = City.new(name: 'Test Cité',
                          coords: nil,
                          start_year: 2017,
                          country: 'Nuevo País',
                          country_state: 'Ille de France')

      new_city.generate_url_name

      assert_equal 'test-cite-nuevo-pais', new_city.url_name
    end
  end
end

