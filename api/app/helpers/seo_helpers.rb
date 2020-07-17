module SEOHelpers
  def title_and_description
    [I18n.t('main.title'), I18n.t('main.description')]
  end

  def city_title_and_description(city)
    [
      interpolate(I18n.t('city.title', city: city.name), '%(city)s', city.name),
      interpolate(I18n.t('city.description', city: city.name), '%(city)s', city.name)
    ]
  end

  # As the keys are crafted to be handled by the frontend, they can't be interpolated
  # by Ruby's i18n gem. That is why we have to hardcodate another interpolate mechanism.
  private
  def interpolate(text, key, value)
    text.gsub(key, value)
  end
end
