require File.expand_path '../../../test_config', __FILE__

describe "start year" do
  it "should automatically set a default start year" do
    city = City.new(name: 'Test City', url_name: 'test-city')
    city.save
    assert_equal Time.now.year, city.start_year
  end

  describe "setting the city start_year on features update" do
    before do
      @city = City.new(name: 'Test City', url_name: 'test-city')
      @city.save
    end

    it "shouldn't set a start year if it is nil" do
      Section.create(city_id: @city.id, buildstart: nil)
      @city.reload
      assert_equal Time.now.year, @city.start_year
    end

    it "shouldn't set a start year if it is zero" do
      Section.create(city_id: @city.id, buildstart: 0)
      @city.reload
      assert_equal Time.now.year, @city.start_year
    end

    it "shouldn't set a start year if it is < 1800" do
      Section.create(city_id: @city.id, buildstart: 1789)
      @city.reload
      assert_equal Time.now.year, @city.start_year
    end

    it "shouldn't set a start year if it is greater than current start_year" do
      Section.create(city_id: @city.id, buildstart: Time.now.year + 2)
      @city.reload
      assert_equal Time.now.year, @city.start_year
    end

    it "should set a start year if the buildstart year is lower than current year and valid" do
      assert_equal Time.now.year, @city.start_year
      Section.create(city_id: @city.id, buildstart: 1991)
      @city.reload
      assert_equal 1991, @city.start_year
    end

    it "should set a start year if the opening year is lower than current year and valid" do
      assert_equal Time.now.year, @city.start_year
      Section.create(city_id: @city.id, opening: 1991)
      @city.reload
      assert_equal 1991, @city.start_year
    end
  end
end
