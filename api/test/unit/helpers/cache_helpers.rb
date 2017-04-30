require File.expand_path '../../../test_config', __FILE__
require 'timecop'

describe CacheHelpers do
  include CacheHelpers

  describe "last_modified_city_date" do
    it "should return the last section updated_at" do
      section1 = Timecop.freeze(Date.today - 4) do
        Section.create(line_id: 222)
      end

      system1 = Timecop.freeze(Date.today - 3) do
        System.create(city_id: 33)
      end

      system2 = Timecop.freeze(Date.today - 2) do
        System.create(city_id: 33)
      end

      section2  = Section.create(line_id: 222)

      assert_equal section2.updated_at, last_modified_city_date
    end

    it "should return the last system updated_at" do
      section1 = Timecop.freeze(Date.today - 4) do
        Section.create(line_id: 222)
      end

      system1 = Timecop.freeze(Date.today - 3) do
        System.create(city_id: 33)
      end

      section2 = Timecop.freeze(Date.today - 2) do
        Section.create(line_id: 222)
      end

      system2 = System.create(city_id: 33)

      assert_equal system2.updated_at, last_modified_city_date
    end
  end
end
