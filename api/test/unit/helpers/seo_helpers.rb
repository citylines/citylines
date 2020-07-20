require File.expand_path '../../../test_config', __FILE__

describe SEOHelpers do
  include SEOHelpers

  describe "title_and_description" do
    before do
      I18n.locale = :en
    end

    it "should return the default title and description" do
      assert_equal ['citylines.co', I18n.t('main.description')], title_and_description
    end

    it "should return the title and description for a city" do
      city = City.create(name: 'Buenos Aires', url_name: 'buenos-aires')

      expected_title = 'Buenos Aires Transit System | citylines.co'
      expected_description = I18n.t('city.description').gsub('%(city)s', city.name)

      assert_equal [expected_title, expected_description], city_title_and_description(city)
    end

    it "should return the title and description for a system" do
      city = City.create(name: 'Buenos Aires', url_name: 'buenos-aires')
      system = System.create(name: 'Subte', city_id: city.id)

      expected_title = 'Buenos Aires Subte | citylines.co'
      expected_description = I18n.t('city.description').gsub('%(city)s', city.name)

      assert_equal [expected_title, expected_description], system_title_and_description(system)
    end

    it "should return the title and description for the Data page" do
      assert_equal ['Our data is open | citylines.co', I18n.t('main.description')], data_title_and_description
    end

    it "should return the title and description for the User page" do
      user = User.create(custom_name:'Pipo', name:'Juan', email:'pipo91@gmail.com')

      assert_equal ['Cities of Pipo | citylines.co', I18n.t('main.description')], user_title_and_description(user)
    end

    describe "title and description for the comparison page" do
      it "should return a default title and description" do
        assert_equal ['Compare | citylines.co', I18n.t('main.description')], compare_title_and_description({})
      end

      it "should return a title and description with one city" do
        ba = City.create(name: 'Buenos Aires', url_name: 'buenos-aires')

        expected_result = ['Comparison: Buenos Aires | citylines.co', I18n.t('main.description')]

        assert_equal expected_result, compare_title_and_description({cities:',buenos-aires'})
        assert_equal expected_result, compare_title_and_description({cities:'buenos-aires,'})
        assert_equal expected_result, compare_title_and_description({cities:'buenos-aires'})
      end

      it "should return a title and description with two cities" do
        ba = City.create(name: 'Buenos Aires', url_name: 'buenos-aires')
        sto = City.create(name: 'Stockholm', url_name: 'stockholm')

        assert_equal ['Comparison: Stockholm vs Buenos Aires | citylines.co', I18n.t('main.description')],
          compare_title_and_description({cities:'stockholm,buenos-aires'})
      end
    end
  end

  describe "canonical_url" do
    it "should only leave allowed params" do
      assert_equal "https://citylines.co?locale=fr", canonical_url("https://citylines.co?locale=fr&geo=56", allowed_params = ["locale"])
      assert_equal "https://citylines.co", canonical_url("https://citylines.co?geo=56", allowed_params = ["locale"])
    end

    it "should do nothing if there are no allowed params set" do
      url = "https://citylines.co?locale=fr&geo=56"
      assert_equal url, canonical_url(url)
    end

    it "should do nothing if there are no query values" do
      url = "https://citylines.co"
      assert_equal url, canonical_url(url, allowed_params = ["locale"])
    end
  end
end
