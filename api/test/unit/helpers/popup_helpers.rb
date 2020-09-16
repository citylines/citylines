require File.expand_path '../../../test_config', __FILE__

describe PopupHelpers do
  include PopupHelpers

  describe "contrasting colors" do
    it "should return a contrasting color if the original color is dark" do
      assert_equal "#fff", line_label_font_color("#c042Be")
    end

    it "should return a contrasting color if the original color is light" do
      assert_equal "#000", line_label_font_color("#f3f075")
    end
  end

  describe "#popup_features_data" do
    before do
      @city = City.new(name: 'Some city',
                          start_year: 2017,
                          url_name: 'city',
                          country: 'Argentina')

      @city.coords = Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)")
      @city.save

      @system = System.create(city_id: @city.id, name: 'A system')

      @line1 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Line 1', url_name: 'line1', color: "#f3f075")

      @section = Section.create(buildstart: 1980, opening: 1985, closure: 1999, city_id: @city.id)
      @section.geometry = Sequel.lit("ST_GeomFromText('LINESTRING(-71.160281 42.258729,-71.160837 42.259113,-71.161144 42.25932)',4326)")
      @section.set_length
      @section.save
      @section.reload

      @section_line1 = SectionLine.create(section_id: @section.id, line_id: @line1.id, city_id: @city.id)
    end

    it "should return data for a feature" do
      expected_data = {
        "Section-#{@section.id}" => {
          buildstart: @section.buildstart,
          buildstart_end: @section.opening,
          feature_closure: @section.closure,
          length: @section.length,
          lines: [{
            'name' => @line1.name,
            'url_name' => @line1.url_name,
            'system' => @line1.system.name,
            'transport_mode_name' => @line1.transport_mode.name,
            'color' => @line1.color,
            'label_font_color' => line_label_font_color(@line1.color),
            'from' => @section.opening,
            'to' => @section.closure
          }]
        }
      }

      assert_equal expected_data, popup_features_data("Section-#{@section.id}")
    end

    it "should handle multiple lines" do
      @line2 = Line.create(city_id: @city.id, system_id: @system.id, name: 'Line 2', url_name: 'line2', color: "#ffff33")
      @section_line2 = SectionLine.create(section_id: @section.id, line_id: @line2.id, city_id: @city.id)

      expected_data = {
        "Section-#{@section.id}" => {
          buildstart: @section.buildstart,
          buildstart_end: @section.opening,
          feature_closure: @section.closure,
          length: @section.length,
          lines: [{
            'name' => @line1.name,
            'url_name' => @line1.url_name,
            'system' => @line1.system.name,
            'transport_mode_name' => @line1.transport_mode.name,
            'color' => @line1.color,
            'label_font_color' => line_label_font_color(@line1.color),
            'from' => @section.opening,
            'to' => @section.closure
          },{
            'name' => @line2.name,
            'url_name' => @line2.url_name,
            'system' => @line2.system.name,
            'transport_mode_name' => @line2.transport_mode.name,
            'color' => @line2.color,
            'label_font_color' => line_label_font_color(@line2.color),
            'from' => @section.opening,
            'to' => @section.closure
          }]
        }
      }

      assert_equal expected_data, popup_features_data("Section-#{@section.id}")
    end

    it "should handle an unset opening" do
      @section.opening = nil
      @section.save

      expected_data = {
        "Section-#{@section.id}" => {
          buildstart: @section.buildstart,
          buildstart_end: @section.closure,
          feature_closure: @section.closure,
          length: @section.length,
          lines: [{
            'name' => @line1.name,
            'url_name' => @line1.url_name,
            'system' => @line1.system.name,
            'transport_mode_name' => @line1.transport_mode.name,
            'color' => @line1.color,
            'label_font_color' => line_label_font_color(@line1.color),
            'from' => @section.closure,
            'to' => @section.closure
          }]
        }
      }

      assert_equal expected_data, popup_features_data("Section-#{@section.id}")
    end

    it "should handle an unset closure" do
      @section.closure = nil
      @section.save

      expected_data = {
        "Section-#{@section.id}" => {
          buildstart: @section.buildstart,
          buildstart_end: @section.opening,
          feature_closure: FeatureCollection::Section::FUTURE,
          length: @section.length,
          lines: [{
            'name' => @line1.name,
            'url_name' => @line1.url_name,
            'system' => @line1.system.name,
            'transport_mode_name' => @line1.transport_mode.name,
            'color' => @line1.color,
            'label_font_color' => line_label_font_color(@line1.color),
            'from' => @section.opening,
            'to' => FeatureCollection::Section::FUTURE
          }]
        }
      }

      assert_equal expected_data, popup_features_data("Section-#{@section.id}")
    end

    it "should handle unset opening and closure" do
      @section.opening = nil
      @section.closure = nil
      @section.save

      expected_data = {
        "Section-#{@section.id}" => {
          buildstart: @section.buildstart,
          buildstart_end: FeatureCollection::Section::FUTURE,
          feature_closure: FeatureCollection::Section::FUTURE,
          length: @section.length,
          lines: [{
            'name' => @line1.name,
            'url_name' => @line1.url_name,
            'system' => @line1.system.name,
            'transport_mode_name' => @line1.transport_mode.name,
            'color' => @line1.color,
            'label_font_color' => line_label_font_color(@line1.color),
            'from' => FeatureCollection::Section::FUTURE,
            'to' => FeatureCollection::Section::FUTURE
          }]
        }
      }

      assert_equal expected_data, popup_features_data("Section-#{@section.id}")
    end

    it "should handle line years data if they are set" do
      @section_line1.fromyear = 1986
      @section_line1.toyear = 1998
      @section_line1.save

      expected_data = {
        "Section-#{@section.id}" => {
          buildstart: @section.buildstart,
          buildstart_end: @section.opening,
          feature_closure: @section.closure,
          length: @section.length,
          lines: [{
            'name' => @line1.name,
            'url_name' => @line1.url_name,
            'system' => @line1.system.name,
            'transport_mode_name' => @line1.transport_mode.name,
            'color' => @line1.color,
            'label_font_color' => line_label_font_color(@line1.color),
            'from' => 1986,
            'to' => 1998
          }]
        }
      }

      assert_equal expected_data, popup_features_data("Section-#{@section.id}")
    end

    it "should handle multiple features at the same time" do
      @station = Station.create(name:'A station', buildstart: 1987, opening: 1988, closure: 1997, city_id: @city.id)
      @station.geometry = Sequel.lit("ST_GeomFromText('POINT(-71.064544 42.28787)',4326)")
      @station.save

      @station_line = StationLine.create(station_id: @station.id, line_id: @line1.id, city_id: @city.id)

      expected_data = {
        "Section-#{@section.id}" => {
          buildstart: @section.buildstart,
          buildstart_end: @section.opening,
          feature_closure: @section.closure,
          length: @section.length,
          lines: [{
            'name' => @line1.name,
            'url_name' => @line1.url_name,
            'system' => @line1.system.name,
            'transport_mode_name' => @line1.transport_mode.name,
            'color' => @line1.color,
            'label_font_color' => line_label_font_color(@line1.color),
            'from' => @section.opening,
            'to' =>  @section.closure
          }]
        },
        "Station-#{@station.id}" => {
          buildstart: @station.buildstart,
          buildstart_end: @station.opening,
          feature_closure: @station.closure,
          name: @station.name,
          lines: [{
            'name' => @line1.name,
            'url_name' => @line1.url_name,
            'system' => @line1.system.name,
            'transport_mode_name' => @line1.transport_mode.name,
            'color' => @line1.color,
            'label_font_color' => line_label_font_color(@line1.color),
            'from' => @station.opening,
            'to' => @station.closure
          }]
        }
      }

      features = "Section-#{@section.id},Station-#{@station.id}"
      assert_equal expected_data, popup_features_data(features)
    end
  end
end
