require File.expand_path '../../../test_config', __FILE__

describe EditorHelpers do
  include EditorHelpers

  describe "update_create_or_delete_feature" do
    before do
      @city = City.create(name: 'Testonia', system_name:'', url_name: 'testonia')
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
    end
  end
end
