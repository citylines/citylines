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
      s1 = Section.create(city_id: @city.id, length:20, buildstart: 1920, opening: 1925, closure: 1930)
      s2 = Section.create(city_id: @city.id, length:10, buildstart: 1920, opening: 1925)
      s3 = Section.create(city_id: @city.id, length:5, buildstart: 1920, opening: 1925)

      SectionLine.create(section_id: s1.id, line_id: @lineA.id, city_id: @city.id)
      SectionLine.create(section_id: s2.id, line_id: @lineB.id, city_id: @city.id)

      SectionLine.create(section_id: s3.id, line_id: @lineA.id, city_id: @city.id)
      SectionLine.create(section_id: s3.id, line_id: @lineB.id, city_id: @city.id)

      result = lines_length_by_year(@city)

      (1920..2000).each do |year|
        if (1920..1924).include?(year)
          assert_equal %w(a), result[year][s1.id][:lines]
          assert_equal %w(b), result[year][s2.id][:lines]
          assert_equal %w(a b), result[year][s3.id][:lines]

          refute result[year][s1.id][:operative]
          refute result[year][s2.id][:operative]
          refute result[year][s3.id][:operative]

          assert_equal 20, result[year][s1.id][:under_construction]
          assert_equal 10, result[year][s2.id][:under_construction]
          assert_equal 5, result[year][s3.id][:under_construction]
        end

        if (1925..1929).include?(year)
          assert_equal %w(a), result[year][s1.id][:lines]
          assert_equal %w(b), result[year][s2.id][:lines]
          assert_equal %w(a b), result[year][s3.id][:lines]

          assert_equal 20, result[year][s1.id][:operative]
          assert_equal 10, result[year][s2.id][:operative]
          assert_equal 5, result[year][s3.id][:operative]

          refute result[year][s1.id][:under_construction]
          refute result[year][s2.id][:under_construction]
          refute result[year][s3.id][:under_construction]
        end

        if year >= 1930
          refute result[year][s1.id]
          assert_equal %w(b), result[year][s2.id][:lines]
          assert_equal %w(a b), result[year][s3.id][:lines]

          assert_equal 10, result[year][s2.id][:operative]
          assert_equal 5, result[year][s3.id][:operative]

          refute result[year][s2.id][:under_construction]
          refute result[year][s3.id][:under_construction]
        end
      end
    end
  end

  describe "#length" do
    it "should return the total km opened by city" do
      city1 = City.create(name: 'City 1', system_name: '', url_name: 'city-1', start_year: 2017)
      city2 = City.create(name: 'City 2', system_name: '', url_name: 'city-2', start_year: 2017)

      Section.create(city_id: city1.id, length: 5000, buildstart: 2010)
      Section.create(city_id: city1.id, length: 10000, opening: 2010)
      Section.create(city_id: city1.id, length: 15000, opening: 1995)
      Section.create(city_id: city1.id, length: 20000, opening: 1990, closure: 1993)

      Section.create(city_id: city2.id, length: 25000, buildstart: 2010)
      Section.create(city_id: city2.id, length: 30000, opening: 2010)
      Section.create(city_id: city2.id, length: 35000, opening: 1995)
      Section.create(city_id: city2.id, length: 40000, opening: 1990, closure: 1993)

      result = lengths

      assert_equal 25, result[city1.id]
      assert_equal 65, result[city2.id]
    end
  end
end
