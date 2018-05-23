require File.expand_path '../../../test_config', __FILE__

describe CityHelpers do
  include CityHelpers

  describe "#city_systems" do
    it "should return the city's systems, sorted" do
      city = City.create(name: 'A city', system_name: '', url_name:'a-city', start_year: 1920)
      s1 = System.create(name: 'Subway', city_id: city.id)
      s2 = System.create(name: 'LRT', city_id: city.id)

      systems = city_systems(city)

      expected_result = [{id: s2.id, name: s2.name}, {id: s1.id, name: s1.name}]
      assert_equal expected_result, systems
    end
  end

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

  describe "top systems" do
    it "should return the top systems" do
      city = City.create(name: 'Trulalá', system_name: '', url_name: 'trulala', start_year: 2017)

      system1 = System.create(name: "Metro", city_id: city.id)
      system2 = System.create(name: "Train", city_id: city.id)

      line1 = Line.create(name: "A", city_id: city.id, system_id: system1.id)
      line2 = Line.create(name: "1", city_id: city.id, system_id: system2.id)

      [{length: 5000, buildstart: 2010},
       {length: 10000, opening: 2010},
       {length: 15000, opening: 1995},
       {length: 20000, opening: 1990, closure: 1993}].each do |data|
         section = Section.create(data.merge(city_id: city.id))
         SectionLine.create(section_id: section.id, line_id: line1.id, city_id: city.id)
       end

      [{length: 25000, buildstart: 2010},
       {length: 30000, opening: 2010},
       {length: 35000, opening: 1995},
       {length: 40000, opening: 1990, closure: 1993}].each do |data|
         section = Section.create(data.merge(city_id: city.id))
         SectionLine.create(section_id: section.id, line_id: line2.id, city_id: city.id)
       end

       results = top_systems

       assert_equal system2.name, results.first[:name]
       assert_equal system2.url, results.first[:url]
       assert_equal system2.city.name, results.first[:city_name]
       assert_equal 65, results.first[:length]

       assert_equal system1.name, results.last[:name]
       assert_equal system1.url, results.last[:url]
       assert_equal system1.city.name, results.last[:city_name]
       assert_equal 25, results.last[:length]
    end
  end
end
