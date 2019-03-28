require File.expand_path '../../../test_config', __FILE__

describe Section do
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

  it "should backup the section properly" do
    assert_equal 0, SectionBackup.count

    @section.backup!

    assert_equal 1, SectionBackup.count
    backup = SectionBackup.first

    assert_equal @section.id, backup.original_id
    assert_equal @section.geometry, backup.geometry
    assert_equal @section.buildstart, backup.buildstart
    assert_equal @section.opening, backup.opening
    assert_equal @section.closure, backup.closure
    assert_equal @section.length, backup.length
    assert_equal @section.osm_id, backup.osm_id
    assert_equal @section.osm_tags, backup.osm_tags
    assert_equal @section.city_id, backup.city_id
  end

  it "should set the city's start_year if it opened or it's building started before the city's start_year" do
    # As section buildstart is 1980, city's start_year should be 1980
    assert_equal 1980, @city.start_year

    # When set the buildstart to an easlier year, the city start year should be
    # modified
    @section.buildstart = 1951
    @section.save

    assert_equal 1951, @city.reload.start_year
  end

  it "should set it's length properly" do
    @section.set_length
    @section.save

    refute_equal 1001, @section.length
    assert (@section.length > 0)
  end

  it "should return the right city" do
    assert_equal @city.id, @section.city.id
  end

  it "should return the lines" do
    assert_equal [@line], @section.lines
  end

  describe "raw_feature" do
    it "should return the right feature" do
      feature = @section.feature.first

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

      feature = @section.feature.first

      expected_lines = [{
          line: @line.name,
          line_url_name: @line.url_name,
          system: @system.name,
      }]

      expected_properties = {id: @section.id,
                             klass: "Section",
                             length: 1001,
                             lines: expected_lines,
                             opening: Section::FUTURE,
                             buildstart: @section.buildstart,
                             osm_id: @section.osm_id,
                             osm_tags: @section.osm_tags,
                             closure: Section::FUTURE}

      assert_equal expected_properties, feature[:properties]
    end

    it "should use opening values if buildstart is not set" do
      @section.buildstart = nil
      @section.save

      feature = @section.feature.first

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

      feature = @section.feature.first

      assert_equal '', feature[:properties][:lines].first[:system]
    end
  end

  describe "formatted_feature" do
    it "should handle one line" do
      features = @section.feature(formatted: true)

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

      features = @section.feature(formatted: true)

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

  describe "valid_geometry?" do
    it "should asses if the geometry is valid or not" do
      multi_linestring = [
        [[10, 10], [20, 20], [10, 40]],
        [[40, 40], [30, 30], [40, 20], [30, 10]]
      ]

      linestring = multi_linestring.first

      assert Section.valid_geometry?(coordinates: multi_linestring, type: 'MultiLineString')

      assert Section.valid_geometry?(coordinates: linestring, type: 'LineString')

      refute Section.valid_geometry?(coordinates: linestring.first, type: 'LineString')

      refute Section.valid_geometry?(coordinates: [linestring.first], type: 'LineString')

      refute Section.valid_geometry?(coordinates: [], type: 'LineString')
    end
  end
end
