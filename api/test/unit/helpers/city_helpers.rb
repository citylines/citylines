require File.expand_path '../../../test_config', __FILE__

describe CityHelpers do
  include CityHelpers

  describe "#lines_length_by_year" do
    before do
      @city = City.create(name: 'Test city', system_name:'', url_name:'test-city', start_year: 1920)
      @lineA = Line.create(name: 'A', city_id: @city.id, url_name: 'a')
      @lineB = Line.create(name: 'B', city_id: @city.id, url_name: 'b')
    end

    it "should return the right length by line by year" do
      Section.create(city_id: @city.id, line_id: @lineA.id, length:20, buildstart: 1920, opening: 1925, closure: 1930)
      Section.create(city_id: @city.id, line_id: @lineB.id, length:10, buildstart: 1920, opening: 1925)

      result = lines_length_by_year(@city)

      (1920..2000).each do |year|
        if (1920..1924).include?(year)
          refute result[year]['a'][:operative]
          refute result[year]['b'][:operative]
          assert_equal 20, result[year]['a'][:under_construction]
          assert_equal 10, result[year]['b'][:under_construction]
        end

        if (1925..1929).include?(year)
          assert_equal 20, result[year]['a'][:operative]
          assert_equal 10, result[year]['b'][:operative]
          refute result[year]['a'][:under_construction]
          refute result[year]['b'][:under_construction]
        end

        if year >= 1930
          refute result[year]['a']
          assert_equal 10, result[year]['b'][:operative]
          refute result[year]['b'][:under_construction]
        end
      end
    end
  end

  describe "#length" do
    it "should return the total km opened by city" do
      city1 = City.create(name: 'City 1', system_name: '', url_name: 'city-1', start_year: 2017)
      city2 = City.create(name: 'City 2', system_name: '', url_name: 'city-2', start_year: 2017)

      Section.create(city_id: city1.id, line_id: 33, length: 5000, buildstart: 2010)
      Section.create(city_id: city1.id, line_id: 33, length: 10000, opening: 2010)
      Section.create(city_id: city1.id, line_id: 33, length: 15000, opening: 1995)
      Section.create(city_id: city1.id, line_id: 33, length: 20000, opening: 1990, closure: 1993)

      Section.create(city_id: city2.id, line_id: 33, length: 25000, buildstart: 2010)
      Section.create(city_id: city2.id, line_id: 33, length: 30000, opening: 2010)
      Section.create(city_id: city2.id, line_id: 33, length: 35000, opening: 1995)
      Section.create(city_id: city2.id, line_id: 33, length: 40000, opening: 1990, closure: 1993)

      result = lengths

      assert_equal 25, result[city1.id]
      assert_equal 65, result[city2.id]
    end
  end
end
