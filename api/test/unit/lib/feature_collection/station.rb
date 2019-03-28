require File.expand_path '../../../../test_config', __FILE__

describe FeatureCollection::Station do
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

  it "formatted_feature should add width and buildstart_end to raw_feature, and remove osm fields" do
    expected_feature = FeatureCollection::Station.by_feature(@station.id).first
    expected_feature[:properties].merge!(
      width: @line.width,
      inner_width: @line.width - 2,
      buildstart_end: @station.opening,
      line_url_name: @station.lines.first.url_name,
    ).reject!{|f| [:osm_tags, :osm_id].include?(f)}

    formatted_feature = FeatureCollection::Station.by_feature(@station.id, formatted: true).first
    assert_equal expected_feature, formatted_feature
  end

  it "should return the right feature, without osm fields because it is raw" do
    feature = FeatureCollection::Station.by_feature(@station.id).first

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
                           name: @station.name,
                           opening: @station.opening,
                           buildstart: @station.buildstart,
                           osm_id: @station.osm_id,
                           osm_tags: @station.osm_tags,
                           closure: @station.closure,
    }

    assert_equal expected_properties, feature[:properties]
  end

  it "should use FUTURE values if opening or closure are nil" do
    @station.opening = nil
    @station.closure = nil
    @station.save

    feature = FeatureCollection::Station.by_feature(@station.id, formatted: true).first

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
                           opening: FeatureCollection::Station::FUTURE,
                           buildstart: @station.buildstart,
                           buildstart_end: FeatureCollection::Station::FUTURE,
                           closure: FeatureCollection::Station::FUTURE,
                           width: @line.width,
                           inner_width: @line.width - 2,
    }

    assert_equal expected_properties, feature[:properties]
  end

  it "should use opening values if buildstart is not set" do
    @station.buildstart = nil
    @station.save

    feature = FeatureCollection::Station.by_feature(@station.id, formatted: true).first

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
                           closure: @station.closure,
                           width: @line.width,
                           inner_width: @line.width - 2,
    }

    assert_equal expected_properties, feature[:properties]
  end

  it "should set system name to an empty string if it is null" do
    system = System.create(city_id: @city.id)

    @line.system_id = system.id
    @line.save

    feature = FeatureCollection::Station.by_feature(@station.id).first

    assert_equal '', feature[:properties][:lines].first[:system]
  end

  it "should return the 'shared station' url_name, and the extra url_nam attrs, if it has more than 1 line" do
    second_line = Line.create(name:'Other line', city_id: @city.id, url_name:'other-line-url-name', system_id: @system.id)

    StationLine.create(line_id: second_line.id, station_id: @station.id, city_id: @city.id)

    feature_props = FeatureCollection::Station.by_feature(@station.id, formatted: true).first[:properties]

    assert_equal 2, @station.lines.count
    assert_equal FeatureCollection::Station::SHARED_STATION_LINE_URL_NAME, feature_props[:line_url_name]
    assert_equal 'a-url-name', feature_props[:line_url_name_1]
    assert_equal 'other-line-url-name', feature_props[:line_url_name_2]
  end

  describe "width" do
    it "should set the radius using the line with the max width" do
      line2 = Line.create(name: 'Other line', city_id: @city.id, url_name: 'other-line', system_id: @system.id, transport_mode_id: 1)
      StationLine.create(line_id: line2.id, station_id: @station.id, city_id: @city.id)

      feature = FeatureCollection::Station.by_feature(@station.id, formatted: true).first

      assert line2.width > @line.width
      assert_equal 2, @station.lines.count
      assert_equal line2.width, feature[:properties][:width]
      assert_equal line2.width - 2, feature[:properties][:inner_width]
    end

    it "should set a 0 inner_radius if the radius if lower than 4" do
      # transport mode 7 is people mover, with a radius of 3
      @line.transport_mode_id = 7
      @line.save

      feature = FeatureCollection::Station.by_feature(@station.id, formatted: true).first

      assert_equal 3, feature[:properties][:width]
      assert_equal 0, feature[:properties][:inner_width]
    end
  end
end
