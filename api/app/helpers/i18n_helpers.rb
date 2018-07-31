require "http/accept"

module I18nHelpers
  def available_locales
    LOCALES.keys
  end

  def browser_locale(request)
    languages = HTTP::Accept::Languages.parse(request.env["HTTP_ACCEPT_LANGUAGE"])
    locale = unless languages.blank?
               languages.first.locale.split("-").first
             end

    locale if available_locales.include?(locale)
  end

  def locale_from_params(params)
    locale = params[:locale]
    locale if !locale.blank? && available_locales.include?(locale)
  end
end
