require File.expand_path '../../../test_config', __FILE__

describe EditorHelpers do
  include EditorHelpers

  describe "update_create_or_delete_feature" do
    before do
      @city = City.create(name: 'Testonia', url_name: 'testonia')
      @user = User.create(name: 'Nuno', email: 'nuno@citylines.co')
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
