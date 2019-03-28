require File.expand_path '../../../../test_config', __FILE__

describe FeatureCollection::Section do
  before do
    @city = City.new(name: 'Some city',
                        system_name: '',
                        start_year: 2017,
                        url_name: 'city',
                        country: 'Argentina')

    @city.coords = Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)")
    @city.save

    @system = System.create(city_id: @city.id, name: 'A system')

    @line = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line', url_name:'test-line')

    @section = Section.new(buildstart: 1980, opening:1985, closure: 1999, length: 1001, osm_id: 555, osm_tags: "tags", city_id: @city.id)
    @section.geometry = Sequel.lit("ST_GeomFromText('LINESTRING(-71.160281 42.258729,-71.160837 42.259113,-71.161144 42.25932)',4326)")
    @section.save

    SectionLine.create(section_id: @section.id, line_id: @line.id, city_id: @city.id)

    @city.reload
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
                             length: 1001,
                             lines: expected_lines,
                             opening: @section.opening,
                             buildstart: @section.buildstart,
                             osm_id: @section.osm_id,
                             osm_tags: @section.osm_tags,
                             closure: @section.closure}

      assert_equal expected_properties, feature[:properties]
    end

    it "should use FUTURE values if opening or closure are nil" do
      @section.opening = nil
      @section.closure = nil
      @section.save

      feature = FeatureCollection::Section.by_feature(@section.id).first

      expected_lines = [{
          line: @line.name,
          line_url_name: @line.url_name,
          system: @system.name,
      }]

      expected_properties = {id: @section.id,
                             klass: "Section",
                             length: 1001,
                             lines: expected_lines,
                             opening: FeatureCollection::Section::FUTURE,
                             buildstart: @section.buildstart,
                             osm_id: @section.osm_id,
                             osm_tags: @section.osm_tags,
                             closure: FeatureCollection::Section::FUTURE}

      assert_equal expected_properties, feature[:properties]
    end

    it "should use opening values if buildstart is not set" do
      @section.buildstart = nil
      @section.save

      feature = FeatureCollection::Section.by_feature(@section.id).first

      expected_lines = [{
          line: @line.name,
          line_url_name: @line.url_name,
          system: @system.name,
      }]

      expected_properties = {id: @section.id,
                             klass: "Section",
                             length: 1001,
                             lines: expected_lines,
                             opening: @section.opening,
                             buildstart: @section.opening,
                             osm_id: @section.osm_id,
                             osm_tags: @section.osm_tags,
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

      expected_properties = {id: "#{@section.id}-#{@line.url_name}",
                             klass: "Section",
                             length: 1001,
                             line: @line.name,
                             line_url_name: @line.url_name,
                             transport_mode_name: @line.transport_mode[:name],
                             width: @line.width,
                             system: @system.name,
                             offset: 0,
                             opening: @section.opening,
                             buildstart: @section.buildstart,
                             buildstart_end: @section.opening,
                             closure: @section.closure}

      assert_equal expected_properties, feature[:properties]
    end

    it "should handle multiple lines" do
      @line2 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line 2', url_name:'test-line-2')
      SectionLine.create(line_id: @line2.id, section_id: @section.id, city_id: @city.id)

      features = FeatureCollection::Section.by_feature(@section.id, formatted: true)

      assert 2, features.count

      assert_equal 'Feature', features.first[:type]
      assert features.first[:geometry]

      assert_equal 'Feature', features.last[:type]
      assert features.last[:geometry]

      expected_properties1 = {id: "#{@section.id}-#{@line.url_name}",
                             klass: "Section",
                             length: 1001,
                             line: @line.name,
                             line_url_name: @line.url_name,
                             transport_mode_name: @line.transport_mode[:name],
                             width: @line.width * 0.75,
                             system: @system.name,
                             offset: -2.25,
                             opening: @section.opening,
                             buildstart: @section.buildstart,
                             buildstart_end: @section.opening,
                             closure: @section.closure}

      assert_equal expected_properties1, features.first[:properties]

      expected_properties2 = {id: "#{@section.id}-#{@line2.url_name}",
                             klass: "Section",
                             length: 1001,
                             line: @line2.name,
                             line_url_name: @line2.url_name,
                             transport_mode_name: @line.transport_mode[:name],
                             width: @line2.width * 0.75,
                             system: @system.name,
                             offset: 2.25,
                             opening: @section.opening,
                             buildstart: @section.buildstart,
                             buildstart_end: @section.opening,
                             closure: @section.closure}

      assert_equal expected_properties2, features.last[:properties]
    end
  end
end
