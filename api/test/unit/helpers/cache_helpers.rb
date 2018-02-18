require File.expand_path '../../../test_config', __FILE__
require 'timecop'

describe CacheHelpers do
  include CacheHelpers
  include CityHelpers

  describe "last_modified_city_date" do
    it "should return the last section updated_at" do
      section1 = Timecop.freeze(Date.today - 4) do
        Section.create(city_id: 33)
      end

      system1 = Timecop.freeze(Date.today - 3) do
        System.create(city_id: 33)
      end

      system2 = Timecop.freeze(Date.today - 2) do
        System.create(city_id: 33)
      end

      section2  = Section.create(city_id: 33)

      assert_equal section2.updated_at, last_modified_city_date
    end

    it "should return the last system updated_at" do
      section1 = Timecop.freeze(Date.today - 4) do
        Section.create(city_id: 33)
      end

      system1 = Timecop.freeze(Date.today - 3) do
        System.create(city_id: 33)
      end

      section2 = Timecop.freeze(Date.today - 2) do
        Section.create(city_id: 33)
      end

      system2 = System.create(city_id: 33)

      assert_equal system2.updated_at, last_modified_city_date
    end

    it "should return the last DeletedFeature created_at" do
      section1 = Timecop.freeze(Date.today - 4) do
        Section.create(city_id: 33)
      end

      system1 = Timecop.freeze(Date.today - 3) do
        System.create(city_id: 33)
      end

      section2 = Timecop.freeze(Date.today - 2) do
        Section.create(city_id: 33)
      end

      deleted_feature = DeletedFeature.create(feature_class: 'Section', city_id: 33)

      assert_equal deleted_feature.created_at, last_modified_city_date
    end

    it "should return the updated_city" do
      section1 = Timecop.freeze(Date.today - 4) do
        Section.create(city_id: 33)
      end

      system1 = Timecop.freeze(Date.today - 3) do
        System.create(city_id: 33)
      end

      section2 = Timecop.freeze(Date.today - 2) do
        Section.create(city_id: 33)
      end

      city = City.create(name: 'Fake City', system_name: '', country: 'Fake Country', url_name: 'fake-city')

      assert_equal city.updated_at, last_modified_city_date
    end
  end

  describe "last_modified_source_feature" do
    before do
      @city = City.create(name: 'Testonia', system_name: '', url_name: 'testonia')
      @city2 = City.create(name: 'Testonia2', system_name: '', url_name: 'testonia2')
    end

    describe "sections" do
      it "should return the last modified feature updated_at" do
        deleted_feature = Timecop.freeze(Date.today - 3) do
          DeletedFeature.create(city_id: @city.id, feature_class: 'Section')
        end

        section1 = Timecop.freeze(Date.today - 2) do
          Section.create(city_id: @city.id)
        end

        section2 = Timecop.freeze(Date.today - 1 ) do
          Section.create(city_id: @city.id)
        end

        section_of_another_city = Section.create(city_id: @city2.id)

        assert_equal section2.updated_at, last_modified_source_feature(@city, 'sections')
      end

      it "should return the last modified section_line updated_at" do
        deleted_feature = Timecop.freeze(Date.today - 3) do
          DeletedFeature.create(city_id: @city.id, feature_class: 'Section')
        end

        section1 = Timecop.freeze(Date.today - 2) do
          Section.create(city_id: @city.id)
        end

        section_line1 = Timecop.freeze(Date.today - 1 ) do
          SectionLine.create(section_id: 99, line_id: 99, city_id: @city.id)
        end

        section_line2 = Timecop.freeze(Date.today) do
          SectionLine.create(section_id: 99, line_id: 99, city_id: @city.id)
        end

        section_of_another_city = Section.create(city_id: @city2.id)

        assert_equal section_line2.updated_at, last_modified_source_feature(@city, 'sections')
      end

      it "should return the last deleted_feature created_at" do
        section1 = Timecop.freeze(Date.today - 3) do
          Section.create(city_id: @city.id)
        end

        section2 = Timecop.freeze(Date.today - 2) do
          Section.create(city_id: @city.id)
        end

        deleted_feature = Timecop.freeze(Date.today - 1) do
          DeletedFeature.create(city_id: @city.id, feature_class: 'Section')
        end

        section_of_another_city = Section.create(city_id: @city2.id)

        assert_equal deleted_feature.created_at, last_modified_source_feature(@city, 'sections')
      end
    end

    describe "stations" do
      it "should return the last modified feature updated_at" do
        deleted_feature = Timecop.freeze(Date.today - 3) do
          DeletedFeature.create(city_id: @city.id, feature_class: 'Station')
        end

        station1 = Timecop.freeze(Date.today - 2) do
          Station.create(city_id: @city.id)
        end

        station2 = Timecop.freeze(Date.today - 1 ) do
          Station.create(city_id: @city.id)
        end

        station_of_another_city = Station.create(city_id: @city2.id)

        assert_equal station2.updated_at, last_modified_source_feature(@city, 'stations')
      end

      it "should return the last modified section_line updated_at" do
        deleted_feature = Timecop.freeze(Date.today - 3) do
          DeletedFeature.create(city_id: @city.id, feature_class: 'Station')
        end

        station1 = Timecop.freeze(Date.today - 2) do
          Station.create(city_id: @city.id)
        end

        station_line1 = Timecop.freeze(Date.today - 1 ) do
          StationLine.create(station_id: 99, line_id: 99, city_id: @city.id)
        end

        station_line2 = Timecop.freeze(Date.today) do
          StationLine.create(station_id: 99, line_id: 99, city_id: @city.id)
        end

        station_of_another_city = Station.create(city_id: @city2.id)

        assert_equal station_line2.updated_at, last_modified_source_feature(@city, 'stations')
      end

      it "should return the last deleted_feature created_at" do
        station1 = Timecop.freeze(Date.today - 3) do
          Station.create(city_id: @city.id)
        end

        station2 = Timecop.freeze(Date.today - 2) do
          Station.create(city_id: @city.id)
        end

        deleted_feature = Timecop.freeze(Date.today - 1) do
          DeletedFeature.create(city_id: @city.id, feature_class: 'Station')
        end

        station_of_another_city = Station.create(city_id: @city2.id)

        assert_equal deleted_feature.created_at, last_modified_source_feature(@city, 'stations')
      end
    end
  end

  describe "last_modified_system_or_line" do
    before do
      @city = City.create(name: 'Testonia', system_name: '', url_name: 'testonia')
    end

    it "should return the system date" do
      line = Timecop.freeze(Date.today - 3) do
        Line.create(city_id: @city.id, name: "Line 1")
      end

      system = Timecop.freeze(Date.today - 1) do
        System.create(city_id: @city.id, name: "Subway")
      end

      # system of another city
      System.create(city_id: 567, name: "Subte")

      last_modified = last_modified_system_or_line(@city)

      assert_equal system.created_at, last_modified
    end

    it "should return the line date" do
      system = Timecop.freeze(Date.today - 3) do
        System.create(city_id: @city.id, name: "Subway")
      end

      line = Timecop.freeze(Date.today - 1) do
        Line.create(city_id: @city.id, name: "Line 1")
      end

      # line of another city
      Line.create(city_id: 567, name: "H")

      last_modified = last_modified_system_or_line(@city)

      assert_equal line.created_at, last_modified
    end

    it "should return the backed up system date" do
      line = Timecop.freeze(Date.today - 3) do
        Line.create(city_id: @city.id, name: "Line 1")
      end

      system = Timecop.freeze(Date.today - 1) do
        SystemBackup.create(original_id: 666, city_id: @city.id, name: "Subway")
      end

      # system of another city
      System.create(city_id: 567, name: "Subte")

      last_modified = last_modified_system_or_line(@city)

      assert_equal system.created_at, last_modified
    end

    it "should return the backed up line date" do
      system = Timecop.freeze(Date.today - 3) do
        System.create(city_id: @city.id, name: "Subway")
      end

      line = Timecop.freeze(Date.today - 1) do
        LineBackup.create(original_id: 666, city_id: @city.id, name: "Line 1")
      end

      # line of another city
      Line.create(city_id: 567, name: "H")

      last_modified = last_modified_system_or_line(@city)

      assert_equal line.created_at, last_modified
    end
  end
end
