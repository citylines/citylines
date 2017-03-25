require File.expand_path '../../../test_config', __FILE__

describe Line do
  before do
    @city = City.new(name: 'Some city',
                     system_name: '',
                     start_year: 2017,
                     url_name: 'city',
                     country: 'Argentina',
                     style: {"line"=>
                             {"hover"=>{"line-color"=>"#000", "line-width"=>7, "line-opacity"=>0.4},
                              "buildstart"=>{"color"=>"#A4A4A4", "line-width"=>7},
                              "opening"=> {"default"=>{"line-width"=>7},
                                           "test-line"=> {"color" => "#e6e6e6"}}},
                             "station"=>
                             {"hover"=>{"circle-radius"=>7, "circle-color"=>"#000", "circle-opacity"=>0.4},
                              "buildstart"=>{"circle-radius"=>7, "color"=>"#A4A4A4", "fillColor"=>"#E6E6E6"},
                              "opening"=>{"circle-radius"=>7, "fillColor"=>"#E6E6E6"},
                              "project"=>{"circle-radius"=>7, "fillColor"=>"#E6E6E6"}}})

    @city.coords = Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)")
    @city.save

    @line = Line.create(city_id: @city.id, name: 'Test line', url_name: 'test-line')
  end

  it "should set the right url_name" do
    assert_equal 'test-line', @line.url_name

    @line.name = " A New Name / Blah "
    @line.save
    @line.generate_url_name

    assert_equal "#{@line.id}-a-new-name---blah", @line.url_name
  end

  it "should return the right values" do
    assert_equal @city.style["line"]["opening"][@line.url_name], @line.style
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
  end
end
