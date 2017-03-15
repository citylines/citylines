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
  end

  describe "backup" do
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
  end
end
