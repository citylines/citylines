require File.expand_path '../../../../test_config', __FILE__

describe FeatureCollection::Section do
  include LineGroupHelpers

  before do
    @city = City.new(name: 'Some city',
                        start_year: 2017,
                        url_name: 'city',
                        country: 'Argentina')

    @city.coords = Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)")
    @city.save

    @system = System.create(city_id: @city.id, name: 'A system')

    @line = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line', url_name:'test-line')

    @section = Section.new(buildstart: 1980, opening:1985, closure: 1999, osm_id: 555, osm_tags: 'tags', osm_metadata: 'metadata', city_id: @city.id)
    @section.geometry = Sequel.lit("ST_GeomFromText('LINESTRING(-71.160281 42.258729,-71.160837 42.259113,-71.161144 42.25932)',4326)")
    @section.save

    @section_line = SectionLine.create(section_id: @section.id, line_id: @line.id, city_id: @city.id)

    @section.reload
    set_feature_line_groups(@section)

    @city.reload
  end

  it "should return a feature collection of raw features" do
    feature_collection = JSON.parse(FeatureCollection::Section.by_city(@city.id), symbolize_names: true)
    assert_equal "FeatureCollection", feature_collection[:type]
    assert_equal 1, feature_collection[:features].count
  end

  it "should return a feature collection of formatted features" do
    feature_collection = JSON.parse(FeatureCollection::Section.by_city(@city.id, formatted: true), symbolize_names: true)
    assert_equal "FeatureCollection", feature_collection[:type]
    assert_equal 1, feature_collection[:features].count
  end

  it "should return an empty set of features collection" do
    @section.destroy

    feature_collection = JSON.parse(FeatureCollection::Section.by_city(@city.id), symbolize_names: true)
    assert_equal "FeatureCollection", feature_collection[:type]
    assert_empty feature_collection[:features]

    feature_collection = JSON.parse(FeatureCollection::Section.by_city(@city.id, formatted: true), symbolize_names: true)
    assert_equal "FeatureCollection", feature_collection[:type]
    assert_empty feature_collection[:features]
  end

  it "should return empty lines if no lines data is available" do
    SectionLine.where(line_id: @line.id).destroy
    @line.destroy

    feature = FeatureCollection::Section.by_feature(@section.id).first
    assert_empty feature[:properties][:lines]
  end

  describe "raw_feature" do
    it "should return the right feature" do
      feature = FeatureCollection::Section.by_feature(@section.id).first

      assert_equal 'Feature', feature[:type]
      assert feature[:geometry]

      expected_lines = [{
          line: @line.name,
          line_url_name: @line.url_name,
          system: @system.name,
      }]

      expected_properties = {id: @section.id,
                             klass: "Section",
                             length: @section.length,
                             lines: expected_lines,
                             opening: @section.opening,
                             buildstart: @section.buildstart,
                             osm_id: @section.osm_id,
                             osm_tags: @section.osm_tags,
                             osm_metadata: @section.osm_metadata,
                             closure: @section.closure}

      assert_equal expected_properties, feature[:properties]
    end

    it "should contain feature_line years if present" do
      @section_line.fromyear = 1956
      @section_line.toyear = 1999
      @section_line.save

      @section.reload
      set_feature_line_groups(@section)

      feature = FeatureCollection::Section.by_feature(@section.id).first

      assert_equal 'Feature', feature[:type]
      assert feature[:geometry]

      expected_lines = [{
          line: @line.name,
          line_url_name: @line.url_name,
          system: @system.name,
          from: 1956,
          to: 1999
      }]

      expected_properties = {id: @section.id,
                             klass: "Section",
                             length: @section.length,
                             lines: expected_lines,
                             opening: @section.opening,
                             buildstart: @section.buildstart,
                             osm_id: @section.osm_id,
                             osm_tags: @section.osm_tags,
                             osm_metadata: @section.osm_metadata,
                             closure: @section.closure}

      assert_equal expected_properties, feature[:properties]
    end

    it "should set system name to an empty string if it is null" do
      system = System.create(city_id: @city.id)

      @line.system_id = system.id
      @line.save

      feature = FeatureCollection::Section.by_feature(@section.id).first

      assert_equal '', feature[:properties][:lines].first[:system]
    end
  end

  describe "formatted_feature" do
    it "should handle one line" do
      features = FeatureCollection::Section.by_feature(@section.id, formatted: true)

      assert 1, features.count
      feature = features.first

      assert_equal 'Feature', feature[:type]
      assert feature[:geometry]

      expected_properties = {id: "#{@section.id}-#{@line.url_name}-0",
                             klass: "Section",
                             line_url_name: @line.url_name,
                             width: @line.width,
                             offset: 0,
                             opening: @section.opening,
                             buildstart: @section.buildstart,
                             buildstart_end: @section.opening,
                             closure: @section.closure}

      assert_equal expected_properties, feature[:properties]
    end

    it "should handle multiple simultaneous lines" do
      @line2 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line 2', url_name:'test-line-2')
      SectionLine.create(line_id: @line2.id, section_id: @section.id, city_id: @city.id)

      @section.reload
      set_feature_line_groups(@section)

      features = FeatureCollection::Section.by_feature(@section.id, formatted: true)

      assert 2, features.count

      assert_equal 'Feature', features.first[:type]
      assert features.first[:geometry]

      assert_equal 'Feature', features.last[:type]
      assert features.last[:geometry]

      expected_properties1 = {id: "#{@section.id}-#{@line.url_name}-0",
                             klass: "Section",
                             line_url_name: @line.url_name,
                             width: @line.width * 0.75,
                             offset: -2.25,
                             opening: @section.opening,
                             buildstart: @section.buildstart,
                             buildstart_end: @section.opening,
                             closure: @section.closure}

      assert_equal expected_properties1, features.first[:properties]

      expected_properties2 = {id: "#{@section.id}-#{@line2.url_name}-0",
                             klass: "Section",
                             line_url_name: @line2.url_name,
                             width: @line2.width * 0.75,
                             offset: 2.25,
                             opening: @section.opening,
                             buildstart: @section.buildstart,
                             buildstart_end: @section.opening,
                             closure: @section.closure}

      assert_equal expected_properties2, features.last[:properties]
    end

    it "should handle two simultaneous lines first, and a single line after" do
      # Two simulataneous lines until 1995
      # ##################################
      # Original line
      @section_line.toyear = 1995
      @section_line.save

      # New line before 1995
      @line2 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line 2', url_name:'test-line-2')
      SectionLine.create(line_id: @line2.id, section_id: @section.id, city_id: @city.id, toyear: 1995)

      # One single line after 1995
      # ##########################
      # This line has another line_group, in order to show it with another offset
      @line3 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line 3', url_name:'test-line-3')
      SectionLine.create(line_id: @line3.id, section_id: @section.id, city_id: @city.id, fromyear: 1995)

      @section.reload
      set_feature_line_groups(@section)

      features = FeatureCollection::Section.by_feature(@section.id, formatted: true)

      assert 3, features.count

      expected_properties = [
        {
          id: "#{@section.id}-#{@line.url_name}-0",
          klass: "Section",
          line_url_name: @line.url_name,
          width: @line.width * 0.75,
          offset: -2.25,
          opening: @section.opening,
          buildstart: @section.buildstart,
          buildstart_end: @section.opening,
          closure: 1995
        },
        {
          id: "#{@section.id}-#{@line2.url_name}-0",
          klass: "Section",
          line_url_name: @line2.url_name,
          width: @line2.width * 0.75,
          offset: 2.25,
          opening: @section.opening,
          buildstart: @section.buildstart,
          buildstart_end: @section.opening,
          closure: 1995
        },
        {
          id: "#{@section.id}-#{@line3.url_name}-1",
          klass: "Section",
          line_url_name: @line3.url_name,
          width: @line3.width,
          offset: 0,
          opening: 1995,
          buildstart: 0,
          buildstart_end: 0,
          closure: @section.closure
        }
      ]

      features.each_with_index do |feature, idx|
        assert_equal 'Feature', feature[:type]
        assert feature[:geometry]
        assert_equal expected_properties[idx], feature[:properties]
      end
    end

    it "should handle complex simultaneous lines" do
      # New line before from 1990
      @line2 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line 2', url_name:'test-line-2')
      SectionLine.create(line_id: @line2.id, section_id: @section.id, city_id: @city.id, fromyear: 1990)

      # Line between 1995 and 1998
      @line3 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line 3', url_name:'test-line-3')
      SectionLine.create(line_id: @line3.id, section_id: @section.id, city_id: @city.id, fromyear: 1995, toyear: 1998)

      @section.reload
      set_feature_line_groups(@section)

      features = FeatureCollection::Section.by_feature(@section.id, formatted: true)

      assert 6, features.count

      expected_properties = [
        {
          id: "#{@section.id}-#{@line.url_name}-0",
          klass: "Section",
          line_url_name: @line.url_name,
          width: 6,
          offset: 0,
          opening: 1985,
          buildstart: 1980,
          buildstart_end: 1985,
          closure: 1990,
        },
        {
          id: "#{@section.id}-test-line-1",
          klass: "Section",
          opening: 1990,
          buildstart: 0,
          buildstart_end: 0,
          closure: 1995,
          line_url_name: "test-line",
          width: 4.5,
          offset: -2.25,
        },
        {
          id: "#{@section.id}-test-line-2",
          klass: "Section",
          opening: 1995,
          buildstart: 0,
          buildstart_end: 0,
          closure: 1998,
          line_url_name: "test-line",
          width: 3.96,
          offset: -3.96,
        },
        {
          id: "#{@section.id}-test-line-3",
          klass: "Section",
          opening: 1998,
          buildstart: 0,
          buildstart_end: 0,
          closure: 1999,
          line_url_name: "test-line",
          width: 4.5,
          offset: -2.25,
        },
        {
          id: "#{@section.id}-test-line-2-1",
          klass: "Section",
          opening: 1990,
          buildstart: 0,
          buildstart_end: 0,
          closure: 1995,
          line_url_name: "test-line-2",
          width: 4.5,
          offset: 2.25,
        },
        {
          id: "#{@section.id}-test-line-2-2",
          klass: "Section",
          opening: 1995,
          buildstart: 0,
          buildstart_end: 0,
          closure: 1998,
          line_url_name: "test-line-2",
          width: 3.96,
          offset: 0,
        },
        {
          id: "#{@section.id}-test-line-2-3",
          klass: "Section",
          opening: 1998,
          buildstart: 0,
          buildstart_end: 0,
          closure: 1999,
          line_url_name: "test-line-2",
          width: 4.5,
          offset: 2.25,
        },
        {
          id: "#{@section.id}-test-line-3-2",
          klass: "Section",
          opening: 1995,
          buildstart: 0,
          buildstart_end: 0,
          closure: 1998,
          line_url_name: "test-line-3",
          width: 3.96,
          offset: 3.96,
        },
      ]

      features.each_with_index do |feature, idx|
        assert_equal 'Feature', feature[:type]
        assert feature[:geometry]
        assert_equal expected_properties[idx], feature[:properties]
      end
    end
    describe "width" do
	    it "should return the right width when the section has 1 line" do
        features = FeatureCollection::Section.by_feature(@section.id, formatted: true)
        feature = features.first
	      assert_equal 1, @section.lines.count
	      assert_equal @section.lines.first.width, feature[:properties][:width]
	    end

      it "should return the right width when the section has 2 lines" do
	      line2 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line 2', url_name:'test-line-2')
	      SectionLine.create(line_id: line2.id, section_id: @section.id, city_id: @city.id)

        @section.reload
        set_feature_line_groups(@section)

	      assert_equal 2, @section.lines.count

        features = FeatureCollection::Section.by_feature(@section.id, formatted: true)
        features.map do |feature|
	        assert_equal @section.lines.first.width * 0.75, feature[:properties][:width]
        end
	    end

      it "should return the right width when the section has 3 or more lines" do
	      line2 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line 2', url_name:'test-line-2')
	      SectionLine.create(line_id: line2.id, section_id: @section.id, city_id: @city.id)

	      line3 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line 3', url_name:'test-line-3')
	      SectionLine.create(line_id: line3.id, section_id: @section.id, city_id: @city.id)

        @section.reload
        set_feature_line_groups(@section)

	      assert_equal 3, @section.lines.count

        features = FeatureCollection::Section.by_feature(@section.id, formatted: true)
        features.map do |feature|
	        assert_equal @section.lines.first.width * 0.66, feature[:properties][:width]
        end
	    end

      it "should use the each line width if lines belong to different transport modes" do
        line2 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line 2', url_name:'test-line-2', transport_mode_id: 1)
        SectionLine.create(line_id: line2.id, section_id: @section.id, city_id: @city.id)

        @section.reload
        set_feature_line_groups(@section)

        assert_equal 2, @section.lines.count

        features = FeatureCollection::Section.by_feature(@section.id, formatted: true)
        expected_widths = [@line, line2].map {|line| line.transport_mode.width * 0.75}
        assert_equal expected_widths, features.map {|feature| feature[:properties][:width]}
      end

      it "should use the min_width" do
        # transport mode 8 is bus, with width = 1 and min_width = 1
        @line.transport_mode_id = 8
        @line.save

        line2 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line 2', url_name:'test-line-2', transport_mode_id: 8)
        SectionLine.create(line_id: line2.id, section_id: @section.id, city_id: @city.id)

        @section.reload
        set_feature_line_groups(@section)

        assert_equal 2, @section.lines.count

        features = FeatureCollection::Section.by_feature(@section.id, formatted: true)
        features.map do |feature|
          assert_equal 1, feature[:properties][:width]
        end
      end
    end
  end
end
