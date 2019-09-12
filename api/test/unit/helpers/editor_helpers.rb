require File.expand_path '../../../test_config', __FILE__

describe EditorHelpers do
  include EditorHelpers

  describe "update_create_or_delete_feature" do
    before do
      @city = City.create(name: 'Testonia', url_name: 'testonia')
      @user = User.create(name: 'Nuno', email: 'nuno@citylines.co')

      @system = System.create(name: 'Metro', city_id: @city.id)
      @line1 = Line.create(name:'Line 1', system_id: @system.id, city_id: @city.id, url_name: 'line-1')
      @line2 = Line.create(name:'Line 2', system_id: @system.id, city_id: @city.id, url_name: 'line-2')
    end

    describe "properties" do
      before do
        @properties = {
          lines: [{line_url_name: @line1.url_name}],
          buildstart: 1988,
          opening: 1993,
          closure: 2018,
          osm_tags: {public_transport: 'stop'}.to_json,
          osm_metadata: {verison: 3}.to_json,
          osm_id: 23232
        }
      end

      it "should create the feature with the passed properties" do
        change = {
          klass: 'Section',
          created: true,
          feature: {
            geometry: {coordinates: [[42.258729,-71.160281],[42.259113, -71.160837]],
                       type: "LineString"},
            properties: @properties
          }
        }

        assert_equal 0, Section.count

        update_create_or_delete_feature(@city, @user, change)
        assert_equal 1, Section.count
        section = Section.first

        assert_equal [@line1], section.lines
        assert_equal 1988, section.buildstart
        assert_equal 1993, section.opening
        assert_equal 2018, section.closure
        assert_equal @properties[:osm_tags], section.osm_tags
        assert_equal @properties[:osm_metadata], section.osm_metadata
        assert_equal 23232, section.osm_id
      end

      it "should update the feature with the passed properties" do
        @section = Section.create(
          city_id: @city.id,
          buildstart: 1950,
          opening: 1960,
          closure: 2000
        )

        @line1.add_to_feature(@section)

        change = {
          klass: 'Section',
          id: @section.id,
          props: true,
          feature: {
            properties: @properties.merge(lines: [{line_url_name: @line2.url_name}])
          }
        }

        update_create_or_delete_feature(@city, @user, change)

        @section.reload

        assert_equal [@line2], @section.lines
        assert_equal 1988, @section.buildstart
        assert_equal 1993, @section.opening
        assert_equal 2018, @section.closure
        assert_equal @properties[:osm_tags], @section.osm_tags
        assert_equal @properties[:osm_metadata], @section.osm_metadata
        assert_equal 23232, @section.osm_id
      end
    end

    describe "sections geometry validation" do
      describe "creation" do
        it "should create a section succesfully" do
          change = {
            klass: 'Section',
            created: true,
            feature: {
              geometry: {coordinates: [[42.258729,-71.160281],[42.259113, -71.160837]],
            type: "LineString"},
              properties: {lines: []}
            }
          }

          assert_equal 0, Section.count

          update_create_or_delete_feature(@city, @user, change)
          assert_equal 1, Section.count
        end

        it "shouldn't create the section because the coords are wrong" do
          change = {
            klass: 'Section',
            created: true,
            feature: {
              geometry: {coordinates: [[42.259113, -71.160837]],
            type: "LineString"},
              properties: {lines: []}
            }
          }

          assert_equal 0, Section.count

          update_create_or_delete_feature(@city, @user, change)
          assert_equal 0, Section.count
        end
      end

      describe "update" do
        before do
          @section = Section.create(city_id: @city.id)
        end

        it "should update the section succesfully" do
          change = {
            klass: 'Section',
            id: @section.id,
            geo: true,
            feature: {
              geometry: {coordinates: [[42.258729,-71.160281],[42.259113, -71.160837]],
            type: "LineString"},
              properties: {lines: []}
            }
          }

          original_geo = @section.geometry

          update_create_or_delete_feature(@city, @user, change)
          refute_equal original_geo, @section.reload.geometry
        end

        it "shouldn't update the section because it has an erroneus geo" do
          change = {
            klass: 'Section',
            id: @section.id,
            geo: true,
            feature: {
              geometry: {coordinates: [[42.258729,-71.160281]],
            type: "LineString"},
              properties: {lines: []}
            }
          }

          original_geo = @section.geometry

          update_create_or_delete_feature(@city, @user, change)
          assert_equal original_geo, @section.reload.geometry
        end
      end
    end
  end
end
