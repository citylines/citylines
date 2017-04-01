require File.expand_path '../../../test_config', __FILE__

describe Line do
  before do
    @city = City.new(name: 'Some city',
                     system_name: '',
                     start_year: 2017,
                     url_name: 'city',
                     country: 'Argentina')

    @city.coords = Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)")
    @city.save

    @system = System.create(city_id: @city.id)

    @line = Line.create(city_id: @city.id, system_id: @system.id, name: 'Test line', url_name: 'test-line', color: '#e6e6e6')
  end

  it "should set the right url_name" do
    assert_equal 'test-line', @line.url_name

    @line.name = " A New Name / Blah "
    @line.save
    @line.generate_url_name

    assert_equal "#{@line.id}-a-new-name---blah", @line.url_name
  end

  it "should return the right values" do
    assert_equal "#e6e6e6", @line.color
  end

  it "should backup the line properly" do
    assert_equal 0, LineBackup.count

    @line.backup!

    assert_equal 1, LineBackup.count
    backup = LineBackup.first

    assert_equal @line.id, backup.original_id
    assert_equal @line.city_id, backup.city_id
    assert_equal @line.name, backup.name
    assert_equal @line.url_name, backup.url_name
    assert_equal @line.color, backup.color
    assert_equal @line.system_id, backup.system_id
  end
end
