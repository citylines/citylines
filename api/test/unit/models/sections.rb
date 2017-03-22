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

    @line = Line.create(city_id: @city.id, name: 'Test line')

    @section = Section.new(line_id: @line.id, buildstart: 1980, opening:1985, closure: 1999, length: 1001)
    @section.geometry = Sequel.lit("ST_GeomFromText('LINESTRING(-71.160281 42.258729,-71.160837 42.259113,-71.161144 42.25932)',4326)")
    @section.save

    @city.reload
  end

  it "should backup the section properly" do
    assert_equal 0, SectionBackup.count

    @section.backup!

    assert_equal 1, SectionBackup.count
    backup = SectionBackup.first

    assert_equal @section.id, backup.original_id
    assert_equal @section.line_id, backup.line_id
    assert_equal @section.geometry, backup.geometry
    assert_equal @section.buildstart, backup.buildstart
    assert_equal @section.opening, backup.opening
    assert_equal @section.closure, backup.closure
    assert_equal @section.length, backup.length
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
    assert_equal @city, @section.city
  end

  describe "feature" do
    it "should return the right feature" do
      feature = @section.feature

      assert_equal 'Feature', feature[:type]
      assert feature[:geometry]

      expected_properties = {id: @section.id,
                             klass: "Section",
                             length: 1001,
                             line: @section.line.name,
                             line_url_name: @section.line.url_name,
                             opening: @section.opening,
                             buildstart: @section.buildstart,
                             buildstart_end: @section.opening,
                             closure: @section.closure}

      assert_equal expected_properties, feature[:properties]
    end

    it "should use future values if opening or closure are nil" do
      @section.opening = nil
      @section.closure = nil
      @section.save

      feature = @section.feature

      expected_properties = {id: @section.id,
                             klass: "Section",
                             length: 1001,
                             line: @section.line.name,
                             line_url_name: @section.line.url_name,
                             opening: Section::FUTURE,
                             buildstart: @section.buildstart,
                             buildstart_end: Section::FUTURE,
                             closure: Section::FUTURE}

      assert_equal expected_properties, feature[:properties]
    end

    it "should use opening values if buildstart is not set" do
      @section.buildstart = nil
      @section.save

      feature = @section.feature

      expected_properties = {id: @section.id,
                             klass: "Section",
                             length: 1001,
                             line: @section.line.name,
                             line_url_name: @section.line.url_name,
                             opening: @section.opening,
                             buildstart: @section.opening,
                             buildstart_end: @section.opening,
                             closure: @section.closure}

      assert_equal expected_properties, feature[:properties]
    end
  end
end
