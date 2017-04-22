module UserHelpers
  def user_cities(user_id)
    h = {}

    created_features_query = %{
      select city_id, feature_class, sum(sections.length), count(distinct feature_id) from created_features left join
        sections on (feature_class = 'Section' and created_features.feature_id = sections.id)
        where user_id = #{user_id} group by city_id, feature_class
    }

    DB.fetch(created_features_query).each do |group|
      city_id = group[:city_id]
      h[city_id] ||= {}
      h[city_id][:created_features] ||= {section_count: 0, section_length: 0, station_count: 0}

      if group[:sum]
        h[city_id][:created_features][:section_length] = (group[:sum] * 1.0 / 1000).round(2)
      end

      key = "#{group[:feature_class].downcase}_count".to_sym
      h[city_id][:created_features][key] = group[:count]
    end

    modified_features_query = %{
      select city_id, feature_class, count(distinct feature_id) from (
        select * from modified_features_geo where user_id = #{user_id} union select * from modified_features_props where user_id = #{user_id}) as modified_features
        group by city_id, feature_class
    }

    DB.fetch(modified_features_query).each do |group|
      city_id = group[:city_id]
      h[city_id] ||= {}
      h[city_id][:modified_features] ||= {section_count: 0, station_count: 0}

      key = "#{group[:feature_class].downcase}_count".to_sym
      h[city_id][:modified_features][key] = group[:count]
    end

    DeletedFeature.where(user_id: user_id).group_and_count(:city_id, :feature_class).each do |group|
      city_id = group[:city_id]
      h[city_id] ||= {}
      h[city_id][:deleted_features] ||= {section_count: 0, station_count: 0}

      key = "#{group[:feature_class].downcase}_count".to_sym
      h[city_id][:deleted_features][key] = group[:count]
    end

    sorted_cities = h.sort_by do |k, v|
      created_features_length = (v[:created_features] || {})[:section_length]
      modified_or_deleted_features = 0

      [:modified_features, :deleted_features].each do |category|
        modified_or_deleted_features += v[category][:section_count] if v[category] && v[category][:section_count]
        modified_or_deleted_features += v[category][:station_count] if v[category] && v[category][:station_count]
      end

      # We sort the cities by:
      # 1) the total length of created features
      # 2) the total number of modified and deleted features
      created_features_length && created_features_length > 0 ? created_features_length * 1000 :  modified_or_deleted_features
    end.reverse

    sorted_cities.map do |id, features|
      city = City[id]
      features[:city] = {name: city.name, country_state: city.country_state, country: city.country, url_name: city.url_name}
      features
    end
  end

  def top_contributors(current_month: false)
    dataset = CreatedFeature.left_join(:sections,
                                       :created_features__feature_id => :sections__id,
                                       :created_features__feature_class => 'Section')
                            .left_join(:users,
                                       :created_features__user_id => :users__id)
                            .exclude(length: nil)
              .select_group(:user_id, :users__name).select_append{sum(:length).as(sum)}
              .order(Sequel.desc(:sum))

    if current_month
      month = Date.today.month
      year = Date.today.year
      range = (Date.new(year, month, 1)...Date.today)
      dataset = dataset.where(created_features__created_at: range)
    end

    dataset.limit(10).map do |row|
      h = row.values
      h[:name] = h[:name].split(' ').first
      h[:sum] = h[:sum] / 1000
      h
    end
  end
end
