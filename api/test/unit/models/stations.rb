require File.expand_path '../../../test_config', __FILE__

describe Station do
  before do
    @city = City.new(name: 'Some city',
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
end
