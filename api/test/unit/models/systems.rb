require File.expand_path '../../../test_config', __FILE__

describe System do
  before do
    @city = City.new(name: 'Some city',
                     system_name: '',
                     start_year: 2017,
                     url_name: 'city',
                     country: 'Argentina')

    @city.coords = Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)")
    @city.save

    @system = System.create(city_id: @city.id, name: 'Overground')
  end

  it "should backup the system properly" do
    assert_equal 0, SystemBackup.count

    @system.backup!

    assert_equal 1, SystemBackup.count
    backup = SystemBackup.first

    assert_equal @system.id, backup.original_id
    assert_equal @system.city_id, backup.city_id
    assert_equal @system.name, backup.name
  end
end
