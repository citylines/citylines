module SEOHelpers
  def title(str)
    if str == I18n.t('main.title')
      return str
    else
      return [str ,' | ', I18n.t('main.title')].join
    end
  end

  def title_and_description
    [
      title(I18n.t('main.title')), I18n.t('main.description')
    ]
  end

  def city_title_and_description(city)
    [
      title(interpolate(I18n.t('city.title'), {city: city.name})),
      interpolate(I18n.t('city.description'), {city: city.name})
    ]
  end

  def system_title_and_description(system)
    [
      title(interpolate(I18n.t('city.system_title'), {system: system.name, city: system.city.name})),
      interpolate(I18n.t('city.description'), {city: system.city.name})
    ]
  end

  def compare_title_and_description(params)
    title_content = nil

    city_url_names = params[:cities] && params[:cities].split(',')
    unless city_url_names.blank?
      cities = City.join(
        Sequel.lit('(select * from unnest(?) with ordinality) as c (url_name, ordering)', Sequel.pg_array(city_url_names)),
          c__url_name: :cities__url_name
      ).order(:c__ordering).map(:name)
      if cities.count > 1
        title_content = cities.join(' vs ')
      elsif cities.count == 1
        title_content = cities.first
      end
    end

    title_str = if title_content.blank?
                  I18n.t('compare.short_title')
                else
                  interpolate(I18n.t('compare.title'), {cities: title_content})
                end

    [
      title(title_str),
      I18n.t('main.description')
    ]
  end

  def data_title_and_description
    [
      title(I18n.t('data.title')), I18n.t('main.description')
    ]
  end

  private

  # As the original i18n keys are supposed to be handled by the frontend, they can't be interpolated
  # by Ruby's i18n gem. That is why we have to implement another interpolate mechanism for the backend.
  def interpolate(text, dict)
    dict.each_pair do |key, value|
      text.gsub!("%(#{key})s", value)
    end
    text
  end
end
