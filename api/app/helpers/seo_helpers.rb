module SEOHelpers
  def title_and_description
    [I18n.t('main.title'), I18n.t('main.description')]
  end

  def city_title_and_description(city)
    [I18n.t('city.title', city: city.name), I18n.t('city.description', city: city.name)]
  end
end
