require "http/accept"

module I18nHelpers
  def available_locales
    LOCALES.keys
  end

  def browser_locale(request)
    return if request.env["HTTP_ACCEPT_LANGUAGE"].blank?
    languages = HTTP::Accept::Languages.parse(request.env["HTTP_ACCEPT_LANGUAGE"])
    locales = languages.map{|lang| lang.locale.split("-").first}.uniq
    (locales & available_locales).first
  end

  def locale_from_params(params)
    locale = params[:locale]
    locale if !locale.blank? && available_locales.include?(locale)
  end
end
