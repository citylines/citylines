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
end
