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
  end

  describe "backup" do
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
  end
end
