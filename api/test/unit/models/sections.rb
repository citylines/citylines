require File.expand_path '../../../test_config', __FILE__

describe Section do
  before do
    @city = City.new(name: 'Some city',
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
