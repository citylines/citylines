require "http/accept"

module I18nHelpers
  def available_locales
    I18n.available_locales
  end

  def browser_locale(request)
    return if request.env["HTTP_ACCEPT_LANGUAGE"].blank?
    languages = HTTP::Accept::Languages.parse(request.env["HTTP_ACCEPT_LANGUAGE"])
    locales = languages.map{|lang| lang.locale.split("-").first.to_sym}.uniq
    (locales & available_locales).first
  end

  def locale_from_params(params)
    locale = params[:locale]
    locale if !locale.blank? && available_locales.include?(locale.to_sym)
  end

  def set_locale(params, request)
    I18n.locale = locale_from_params(params) || browser_locale(request) || I18n.default_locale
  end

  def all_translations
    I18n.backend.send(:translations)[I18n.locale]
  end
end
