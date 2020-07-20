require File.expand_path '../../../test_config', __FILE__

describe SEOHelpers do
  include SEOHelpers

  describe "canonical_url" do
    it "should only leave allowed params" do
      assert_equal "https://citylines.co?locale=fr", canonical_url("https://citylines.co?locale=fr&geo=56", allowed_params = ["locale"])
      assert_equal "https://citylines.co", canonical_url("https://citylines.co?geo=56", allowed_params = ["locale"])
    end

    it "should do nothing if there are now allowed params set" do
      url = "https://citylines.co?locale=fr&geo=56"
      assert_equal url, canonical_url(url)
    end

    it "should do nothing if there are no query values" do
      url = "https://citylines.co"
      assert_equal url, canonical_url(url, allowed_params = ["locale"])
    end
  end
end
