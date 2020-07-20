require File.expand_path '../../../test_config', __FILE__

describe I18nHelpers do
  include I18nHelpers

  it "should return the available locales" do
    assert I18n.available_locales
    assert I18n.default_locale
  end

  describe "browser_locale" do
    it "should return the first available_browser locale" do
      I18n.available_locales.each do |locale|
        request = OpenStruct.new(env: {"HTTP_ACCEPT_LANGUAGE" => "xa-XA,rr-RR,#{locale}-CC,fr-FR"})
        assert_equal locale, browser_locale(request)
      end
    end

    it "should return nil because the locale is not available" do
      request = OpenStruct.new(env: {"HTTP_ACCEPT_LANGUAGE" => 'ze-PE'})
      refute browser_locale(request)
    end

    it "should reutn nil because the header is blank" do
      request = OpenStruct.new(env: {"HTTP_ACCEPT_LANGUAGE" => ''})
      refute browser_locale(request)
    end

    it "should reutn nil because the header is nil" do
      request = OpenStruct.new(env: {})
      refute browser_locale(request)
    end
  end

  describe "locale_from_params" do
    it "should return the locale if it's available" do
      I18n.available_locales.each do |locale|
        assert_equal locale, locale_from_params(locale: locale.to_s)
      end
    end

    it "should return nil if the locale is not supported" do
      refute locale_from_params(locale: 'we')
    end

    it "should return nil if the param is not present" do
      refute locale_from_params({})
    end
  end

  describe "set_locale" do
    it "should set and return the default locale" do
      assert_equal I18n.default_locale, set_locale({}, OpenStruct.new(env: {}))
      assert_equal I18n.default_locale, I18n.locale
    end

    it "should set and return the locale from params" do
      assert_equal :es, set_locale({locale: 'es'}, OpenStruct.new(env: {}))
      assert_equal :es, I18n.locale
    end

    it "should set and return the locale from browser" do
      assert_equal :fr, set_locale({}, OpenStruct.new(env: {"HTTP_ACCEPT_LANGUAGE" => 'fr-FR'}))
      assert_equal :fr, I18n.locale
    end
  end

  describe "locale_translations" do
    it "should return all the translations for the current locale" do
      assert_equal I18n.t('main.title'), locale_translations[:main][:title]
    end
  end
end
