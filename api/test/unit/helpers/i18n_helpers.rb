require File.expand_path '../../../test_config', __FILE__

describe I18nHelpers do
  include I18nHelpers

  it "should exist the i18n config" do
    refute LOCALES.blank?
    assert DEFAULT_LOCALE
  end

  it "should return the available locales" do
    assert_equal LOCALES.keys, available_locales
  end

  describe "browser_locale" do
    it "should return an available_browser locale" do
      available_locales.each do |locale|
        request = OpenStruct.new(env: {"HTTP_ACCEPT_LANGUAGE" => "#{locale}-CC"})
        assert_equal locale, browser_locale(request)
      end
    end

    it "should return nil because the locale is not available" do
      request = OpenStruct.new(env: {"HTTP_ACCEPT_LANGUAGE" => 'ze-PE'})
      refute browser_locale(request)
    end

    it "should reutn nil because the header is not set" do
      request = OpenStruct.new(env: {"HTTP_ACCEPT_LANGUAGE" => ''})
      refute browser_locale(request)
    end
  end

  describe "locale_from_params" do
    it "should return the locale if it's available" do
      available_locales.each do |locale|
        assert_equal locale, locale_from_params(locale: locale)
      end
    end

    it "should return nil if the locale is not supported" do
      refute locale_from_params(locale: 'we')
    end

    it "should return nil if the param is not present" do
      refute locale_from_params({})
    end
  end
end
