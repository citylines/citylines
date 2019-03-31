require File.expand_path '../../../test_config', __FILE__

describe Line do
  before do
    @city = City.new(name: 'Some city',
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

  describe "add/remove to/from features" do
    before do
      @feature = Section.create(city_id: @city.id)
    end

    it "should be added to the feature" do
      assert 0, @feature.lines.count

      @line.add_to_feature(@feature)

      assert 1, @feature.lines.count

      assert @line, @feature.lines.first
    end

    it "should be removed from the feature" do
      @line.add_to_feature(@feature)

      assert 1, @feature.lines.count

      @line.remove_from_feature(@feature)

      assert 0, @feature.lines.count
    end
  end

  describe "transport modes" do
    it "should return the right transport mode info" do
      line = Line.create(city_id: @city.id, name: 'Test', transport_mode_id: 4)

      assert_equal TransportMode[4], line.transport_mode
      assert_equal TransportMode[4].width, line.width
      assert_equal TransportMode[4].min_width, line.min_width
    end

    it "should return the default transport mode if it's not set" do
      line = Line.create(city_id: @city.id, name: 'Test')

      assert_equal TransportMode[0], line.transport_mode
      assert_equal TransportMode[0].width, line.width
      assert_equal TransportMode[0].min_width, line.min_width
    end
  end
end
