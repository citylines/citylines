require File.expand_path '../../../test_config', __FILE__

describe Station do
  before do
    @city = City.new(name: 'Some city',
                        system_name: '',
                        start_year: 2017,
                        url_name: 'city',
                        country: 'Argentina')

    @city.coords = Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)")
    @city.save

    @system = System.create(city_id: @city.id, name: 'A system')

    @line = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line', url_name: 'a-url-name')

    @station = Station.new(buildstart: 1980, opening:1985, closure: 1999, name: 'Some station', osm_id: 456, osm_tags: 'tags', city_id: @city.id)
    @station.geometry = Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)")
    @station.save

    StationLine.create(station_id: @station.id, line_id: @line.id, city_id: @city.id)

    @city.reload
  end

  it "should backup the station properly" do
    assert_equal 0, StationBackup.count

    @station.backup!

    assert_equal 1, StationBackup.count
    backup = StationBackup.first

    assert_equal @station.id, backup.original_id
    assert_equal @station.geometry, backup.geometry
    assert_equal @station.buildstart, backup.buildstart
    assert_equal @station.opening, backup.opening
    assert_equal @station.closure, backup.closure
    assert_equal @station.name, backup.name
    assert_equal @station.osm_id, backup.osm_id
    assert_equal @station.osm_tags, backup.osm_tags
    assert_equal @station.city_id, backup.city_id
  end

  it "should set the city's start_year if the station opened or it's building started before the city's start_year" do
    # As section buildstart is 1980, city's start_year should be 1980
    assert_equal 1980, @city.start_year

    # When set the buildstart to an easlier year, the city start year should be
    # modified
    @station.buildstart = 1951
    @station.save

    assert_equal 1951, @city.reload.start_year
  end

  it "should return the right city" do
    assert_equal @city.id, @station.city.id
  end

  it "should return the lines" do
    assert_equal [@line], @station.lines
  end

  describe "feature" do
    it "should be equal to raw_feature and formatted_feature" do
      feature = @station.feature
      assert_equal feature, @station.raw_feature
      assert_equal feature, @station.formatted_feature
    end

    it "should return the right feature" do
      feature = @station.feature

      assert_equal 'Feature', feature[:type]
      assert feature[:geometry]

      expected_lines = [{
        line: @line.name,
        line_url_name: @line.url_name,
        system: @system.name,
        transport_mode_name: @line.transport_mode[:name]
      }]

      expected_properties = {id: @station.id,
                             klass: "Station",
                             lines: expected_lines,
                             line_url_name: @station.lines.first.url_name,
                             name: @station.name,
                             opening: @station.opening,
                             buildstart: @station.buildstart,
                             buildstart_end: @station.opening,
                             osm_id: @station.osm_id,
                             osm_tags: @station.osm_tags,
                             closure: @station.closure,
                             width: @station.radius,
                             inner_width: @station.inner_radius}

      assert_equal expected_properties, feature[:properties]
    end

    it "should use FUTURE values if opening or closure are nil" do
      @station.opening = nil
      @station.closure = nil
      @station.save

      feature = @station.feature

      expected_lines = [{
        line: @line.name,
        line_url_name: @line.url_name,
        system: @system.name,
        transport_mode_name: @line.transport_mode[:name]
      }]

      expected_properties = {id: @station.id,
                             klass: "Station",
                             lines: expected_lines,
                             line_url_name: @station.lines.first.url_name,
                             name: @station.name,
                             opening: Section::FUTURE,
                             buildstart: @station.buildstart,
                             buildstart_end: Section::FUTURE,
                             osm_id: @station.osm_id,
                             osm_tags: @station.osm_tags,
                             closure: Section::FUTURE,
                             width: @station.radius,
                             inner_width: @station.inner_radius}

      assert_equal expected_properties, feature[:properties]
    end

    it "should use opening values if buildstart is not set" do
      @station.buildstart = nil
      @station.save

      feature = @station.feature

      expected_lines = [{
        line: @line.name,
        line_url_name: @line.url_name,
        system: @system.name,
        transport_mode_name: @line.transport_mode[:name]
      }]

      expected_properties = {id: @station.id,
                             klass: "Station",
                             lines: expected_lines,
                             line_url_name: @station.lines.first.url_name,
                             name: @station.name,
                             opening: @station.opening,
                             buildstart: @station.opening,
                             buildstart_end: @station.opening,
                             osm_id: @station.osm_id,
                             osm_tags: @station.osm_tags,
                             closure: @station.closure,
                             width: @station.radius,
                             inner_width: @station.inner_radius}

      assert_equal expected_properties, feature[:properties]
    end

    it "should set system name to an empty string if it is null" do
      system = System.create(city_id: @city.id)

      @line.system_id = system.id
      @line.save

      assert_equal '', @station.reload.feature[:properties][:lines].first[:system]
    end

    it "should return the 'shared station' url_name, and the extra url_nam attrs, if it has more than 1 line" do
      second_line = Line.create(name:'Other line', city_id: @city.id, url_name:'other-line-url-name', system_id: @system.id)

      StationLine.create(line_id: second_line.id, station_id: @station.id, city_id: @city.id)

      feature_props = @station.feature[:properties]

      assert_equal 2, @station.lines.count
      assert_equal Station::SHARED_STATION_LINE_URL_NAME, feature_props[:line_url_name]
      assert_equal 'a-url-name', feature_props[:line_url_name_1]
      assert_equal 'other-line-url-name', feature_props[:line_url_name_2]
    end
  end

  describe "width" do
    it "should set the radius using the line with the max width" do
      line2 = Line.create(name: 'Other line', city_id: @city.id, url_name: 'other-line', system_id: @system.id, transport_mode_id: 1)
      StationLine.create(line_id: line2.id, station_id: @station.id, city_id: @city.id)

      assert line2.width > @line.width
      assert_equal 2, @station.lines.count
      assert_equal line2.width, @station.radius
      assert_equal @station.radius - 2, @station.inner_radius
    end

    it "should set a 0 inner_radius if the radius if lower than 4" do
      # transport mode 7 is people mover, with a radius of 3
      @line.transport_mode_id = 7
      @line.save

      assert_equal 3, @station.radius
      assert_equal 0, @station.inner_radius
    end
  end
end
