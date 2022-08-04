require "http/accept"

module I18nHelpers
  def browser_locale(request)
    return if request.env["HTTP_ACCEPT_LANGUAGE"].blank?
    begin
      languages = HTTP::Accept::Languages.parse(request.env["HTTP_ACCEPT_LANGUAGE"])
    rescue HTTP::Accept::ParseError
      logger.warn("Invalid HTTP_ACCEPT_LANGUAGE header: #{request.env["HTTP_ACCEPT_LANGUAGE"]}")
      return
    end
    locales = languages.map{|lang| lang.locale.split("-").first.to_sym}.uniq
    (locales & I18n.available_locales).first
  end

  def locale_from_params(params)
    locale = params[:locale] && params[:locale].to_sym
    locale if !locale.blank? && I18n.available_locales.include?(locale)
  end

  def set_locale(params, request)
    I18n.locale = locale_from_params(params) || browser_locale(request) || I18n.default_locale
  end

  def locale_translations
    I18n.backend.send(:translations)[I18n.locale]
  end
end
