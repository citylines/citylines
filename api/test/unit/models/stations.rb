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

    @line = Line.create(city_id: @city.id, name: 'Test line')

    @station = Station.new(line_id: @line.id, buildstart: 1980, opening:1985, closure: 1999, name: 'Some station')
    @station.geometry = Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)")
    @station.save

    @city.reload
  end

  it "should backup the station properly" do
    assert_equal 0, StationBackup.count

    @station.backup!

    assert_equal 1, StationBackup.count
    backup = StationBackup.first

    assert_equal @station.id, backup.original_id
    assert_equal @station.line_id, backup.line_id
    assert_equal @station.geometry, backup.geometry
    assert_equal @station.buildstart, backup.buildstart
    assert_equal @station.opening, backup.opening
    assert_equal @station.closure, backup.closure
    assert_equal @station.name, backup.name
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
    assert_equal @city, @station.city
  end

  describe "feature" do
    it "should return the right feature" do
      feature = @station.feature

      assert_equal 'Feature', feature[:type]
      assert feature[:geometry]

      expected_properties = {id: @station.id,
                             klass: "Station",
                             line: @station.line.name,
                             line_url_name: @station.line.url_name,
                             name: @station.name,
                             opening: @station.opening,
                             buildstart: @station.buildstart,
                             buildstart_end: @station.opening,
                             closure: @station.closure}

      assert_equal expected_properties, feature[:properties]
    end

    it "should use FUTURE values if opening or closure are nil" do
      @station.opening = nil
      @station.closure = nil
      @station.save

      feature = @station.feature

      expected_properties = {id: @station.id,
                             klass: "Station",
                             line: @station.line.name,
                             line_url_name: @station.line.url_name,
                             name: @station.name,
                             opening: Section::FUTURE,
                             buildstart: @station.buildstart,
                             buildstart_end: Section::FUTURE,
                             closure: Section::FUTURE}

      assert_equal expected_properties, feature[:properties]
    end

    it "should use opening values if buildstart is not set" do
      @station.buildstart = nil
      @station.save

      feature = @station.feature

      expected_properties = {id: @station.id,
                             klass: "Station",
                             line: @station.line.name,
                             line_url_name: @station.line.url_name,
                             name: @station.name,
                             opening: @station.opening,
                             buildstart: @station.opening,
                             buildstart_end: @station.opening,
                             closure: @station.closure}

      assert_equal expected_properties, feature[:properties]
    end
  end
end
