require File.expand_path '../../../test_config', __FILE__

describe CityHelpers do
  include CityHelpers

  describe "#city_systems" do
    it "should return the city's systems, sorted" do
      city = City.create(name: 'A city', url_name:'a-city', start_year: 1920)
      s1 = System.create(name: 'Subway', city_id: city.id)
      s2 = System.create(name: 'LRT', city_id: city.id, historic: true, project: true)

      systems = city_systems(city)

      expected_result = [{id: s2.id, name: s2.name, historic: true, project: true}, {id: s1.id, name: s1.name}]
      assert_equal expected_result, systems
    end
  end

  describe "#lines_length_by_year" do
    before do
      @city = City.create(name: 'Test city', url_name:'test-city', start_year: 1920)
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

    it "shouldn't use years lower than start_year" do
      s1 = Section.create(city_id: @city.id, length:20, buildstart: 0, opening: 0, closure: 1930)
      result = lines_length_by_year(@city)
      years = result.keys

      assert_equal 1920, years.min
      assert_equal 1930, years.max
    end
  end

  describe "length" do
    it "should return the total opened km by city" do
      city1 = City.create(name: 'City 1', url_name: 'city-1', start_year: 2017)
      city2 = City.create(name: 'City 2', url_name: 'city-2', start_year: 2017)

      Section.create(city_id: city1.id, length: 5000, buildstart: 2010)
      Section.create(city_id: city1.id, length: 10000, opening: 2010)
      Section.create(city_id: city1.id, length: 15000, opening: 1995)
      Section.create(city_id: city1.id, length: 20000, opening: 1990, closure: 1993)

      Section.create(city_id: city2.id, length: 25000, buildstart: 2010)
      Section.create(city_id: city2.id, length: 30000, opening: 2010)
      Section.create(city_id: city2.id, length: 35000, opening: 1995)
      Section.create(city_id: city2.id, length: 40000, opening: 1990, closure: 1993)

      assert_equal 25000, city_length(city1)
      assert_equal 65000, city_length(city2)
    end

    it "should return the total opened km by system" do
      city = City.create(name: 'Trulalá', url_name: 'trulala', start_year: 2017)

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

       assert_equal 25000, system_length(system1)
       assert_equal 65000, system_length(system2)
    end

    it "should return the total opened km by system avoiding duplicated sections (multiple lines in same section)" do
      city = City.create(name: 'Trulalá', url_name: 'trulala', start_year: 2017)

      system = System.create(name: "Metro", city_id: city.id)

      line1 = Line.create(name: "A", city_id: city.id, system_id: system.id)
      line2 = Line.create(name: "A2", city_id: city.id, system_id: system.id)

      [{length: 5000, buildstart: 2010},
       {length: 10000, opening: 2010},
       {length: 15000, opening: 1995},
       {length: 20000, opening: 1990, closure: 1993}].each do |data|
         section = Section.create(data.merge(city_id: city.id))
         SectionLine.create(section_id: section.id, line_id: line1.id, city_id: city.id)
       end

       # We assign the second line also to the 2nd section
       section = Section.where(length: 10000).first
       SectionLine.create(section_id: section.id, line_id: line2.id, city_id: city.id)

       # Naive calculation counts twice the same section
       assert_equal 35000, system.lines.
         map{|l| l.sections.select{|s| !s.opening.nil? && s.opening <= Time.now.year && (s.closure.nil? || s.closure >= Time.now.year)}.map(&:length)}.
         flatten.inject(:+)

       # Correct calculation
       assert_equal 25000, system_length(system)
    end
  end

  describe "contributors" do
    before do
      @city1 = City.create(name: 'City 1', url_name: 'city-1', start_year: 2017)
      @city2 = City.create(name: 'City 2', url_name: 'city-2', start_year: 2017)

      @juan = User.create(name: "Juan Pérez", email: 'juan@test.co', custom_name: 'Pepito', img_url: 'pepito.png')
      @pepe = User.create(name: "Pepe Martínez", email: 'pepe@test.com')
      @jorge = User.create(name: "Jorge Rodríguez", email: 'jorge@test.com')
    end

    it "should return the cities contributors" do
=begin
      section = Section.create(city_id: @city1.id, geometry: Sequel.lit("ST_GeomFromText('LINESTRING(-71.160281 42.258729,-71.160837 42.259113,-71.161144 42.25932)',4326)"))
      section2 = Section.create(city_id: @city2.id, geometry: Sequel.lit("ST_GeomFromText('LINESTRING(-71.160281 42.258729,-71.160837 42.259113,-71.161144 42.25932)',4326)"))
      section3 = Section.create(city_id: @city2.id, geometry: Sequel.lit("ST_GeomFromText('LINESTRING(-71.160281 42.258729,-71.160837 42.259113,-71.161144 42.25932)',4326)"))
=end
      # City 1
      CreatedFeature.create(user_id: @juan.id, feature_class: 'Section', city_id: @city1.id)
      ModifiedFeatureProps.create(user_id: @juan.id, feature_class: 'Section', city_id: @city1.id)

      # City 2
      CreatedFeature.create(user_id: @pepe.id, feature_class: 'Section', city_id: @city2.id)
      ModifiedFeatureGeo.create(user_id: @pepe.id, feature_class: 'Section', city_id: @city2.id)
      CreatedFeature.create(user_id: @jorge.id, feature_class: 'Section', city_id: @city2.id)
      DeletedFeature.create(user_id: @jorge.id, feature_class: 'Section', city_id: @city2.id)

      assert_equal 1, city_contributors(@city1)
      assert_equal 2, city_contributors(@city2)
    end

    it "should return the systems contributors" do
      system1 = System.create(name: "Metro", city_id: @city1.id)
      system2 = System.create(name: "Train", city_id: @city1.id)

      line1 = Line.create(name: "A", city_id: @city1.id, system_id: system1.id)
      line2 = Line.create(name: "1", city_id: @city1.id, system_id: system2.id)

      section = Section.create(city_id: @city1.id, geometry: Sequel.lit("ST_GeomFromText('LINESTRING(-71.160281 42.258729,-71.160837 42.259113,-71.161144 42.25932)',4326)"))
      SectionLine.create(section_id: section.id, line_id: line1.id, city_id: @city1.id)

      section2 = Section.create(city_id: @city1.id, geometry: Sequel.lit("ST_GeomFromText('LINESTRING(-71.160281 42.258729,-71.160837 42.259113,-71.161144 42.25932)',4326)"))
      SectionLine.create(section_id: section2.id, line_id: line2.id, city_id: @city1.id)
      section3 = Section.create(city_id: @city1.id, geometry: Sequel.lit("ST_GeomFromText('LINESTRING(-71.160281 42.258729,-71.160837 42.259113,-71.161144 42.25932)',4326)"))
      SectionLine.create(section_id: section3.id, line_id: line2.id, city_id: @city1.id)

      station = Station.create(city_id: @city1.id)
      StationLine.create(station_id: station.id, line_id: line2.id, city_id: @city1.id)

      # System 1
      CreatedFeature.create(user_id: @juan.id, feature_class: 'Section', feature_id: section.id)
      ModifiedFeatureProps.create(user_id: @juan.id, feature_class: 'Section', feature_id: section.id)

      # System 2
      CreatedFeature.create(user_id: @juan.id, feature_class: 'Station', feature_id: station.id)
      CreatedFeature.create(user_id: @pepe.id, feature_class: 'Section', feature_id: section2.id)
      ModifiedFeatureGeo.create(user_id: @pepe.id, feature_class: 'Section', feature_id: section2.id)
      CreatedFeature.create(user_id: @jorge.id, feature_class: 'Section', feature_id: section3.id)

      assert_equal 1, system_contributors(system1)
      assert_equal 3, system_contributors(system2)
    end
  end

  describe "#search_city_or_system_by_term" do
    before do
      @buenos_aires = City.create(name: 'Buenos Aires', url_name: 'buenos-aires', country_state: nil, country: 'Argentina', contributors: 7, length: 2000)
      @new_york = City.create(name: 'New York City', url_name:'ny_city')
      @subay = City.create(name: 'Subay', url_name: 'subay')

      @subte = System.create(name: 'Subte', length: 1000, city_id: @buenos_aires.id, contributors: 3)
      @subway = System.create(name: 'Subway', city_id: @new_york.id)
    end

    it "should return a city" do
      res = search_city_or_system_by_term('buenos', 1,5)
      assert_equal 1, res.count
      assert_equal 'Buenos Aires', res.first[:name]
      refute res.first[:city_name]
      refute res.first[:state]
      refute res.first[:historic]
      refute res.first[:project]
      assert_equal 'Argentina', res.first[:country]
      assert_equal 2, res.first[:length]
      assert_equal ['Subte'], res.first[:systems]
      assert_equal 7, res.first[:contributors_count]
      assert_equal '/buenos-aires', res.first[:url]
    end

    it "should return a system" do
      res = search_city_or_system_by_term('subte', 1,5)
      assert_equal 1, res.count
      assert_equal 'Subte', res.first[:name]
      assert_equal 'Buenos Aires', res.first[:city_name]
      refute res.first[:state]
      refute res.first[:historic]
      refute res.first[:project]
      assert_equal 'Argentina', res.first[:country]
      assert_equal 1, res.first[:length]
      refute res.first[:systems]
      assert_equal 3, res.first[:contributors_count]
      assert_equal "/buenos-aires?system_id=#{@subte.id}", res.first[:url]
    end

    it "should return a system with historic and project tags" do
      @subte.historic = true
      @subte.project = true
      @subte.save

      res = search_city_or_system_by_term('subte', 1,5)
      assert_equal 1, res.count
      assert_equal 'Subte', res.first[:name]
      assert_equal 'Buenos Aires', res.first[:city_name]
      refute res.first[:state]
      assert res.first[:historic]
      assert res.first[:project]
      assert_equal 'Argentina', res.first[:country]
      assert_equal 1, res.first[:length]
      refute res.first[:systems]
      assert_equal 3, res.first[:contributors_count]
      assert_equal "/buenos-aires?system_id=#{@subte.id}", res.first[:url]
    end

    it "should return a city and two systems, sorted by length and name" do
      res = search_city_or_system_by_term('sub', 1,5)
      assert_equal 3, res.count
      assert_equal 'Subte', res.first[:name]
      assert_equal 'Subay', res[1][:name]
      assert_equal 'Subway', res[2][:name]
    end
  end
end
