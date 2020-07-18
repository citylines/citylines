module SEOHelpers
  def title_and_description
    [I18n.t('main.title'), I18n.t('main.description')]
  end

  def city_title_and_description(city)
    [
      interpolate(I18n.t('city.title'), {'%(city)s' => city.name}),
      interpolate(I18n.t('city.description'), {'%(city)s' => city.name})
    ]
  end

  def system_title_and_description(system)
    [
      interpolate(I18n.t('city.system_title'),
                  {'%(system)s' => system.name,'%(city)s' => system.city.name}),
      interpolate(I18n.t('city.description'), {'%(city)s' => system.city.name})
    ]
  end
  private

  # As the original i18n keys are supposed to be handled by the frontend, they can't be interpolated
  # by Ruby's i18n gem. That is why we have to implement another interpolate mechanism for the backend.
  def interpolate(text, dict)
    dict.each_pair do |key, value|
      text.gsub!(key, value)
    end
    text
  end
end
