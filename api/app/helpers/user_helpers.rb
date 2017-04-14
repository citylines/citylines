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

    h
  end
end
