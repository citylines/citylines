module UserHelpers
  def user_cities(user_id)
    h = {}

    CreatedFeature
    .where(user_id: user_id)
    .left_join(:sections, :created_features__feature_class => 'Section', :created_features__feature_id => :sections__id)
    .each do |created_feature|
      city_id = created_feature[:city_id]
      h[city_id] ||= {}
      h[city_id][:created_features] ||= {section_count: 0, section_length: 0, station_count: 0}

      if created_feature[:feature_class] == 'Section'
        h[city_id][:created_features][:section_count] += 1

        unless created_feature[:length]
          # If there is no length, it probably means that the section has been deleted.
          # Thats why we try to fetch the length from the SectionBackup

          backup = SectionBackup.where(original_id: created_feature[:feature_id]).first

          next unless backup

          created_feature[:length] = backup.length
        end

        h[city_id][:created_features][:section_length] += created_feature[:length]
      else
        h[city_id][:created_features][:station_count] += 1
      end
    end

    modified_features_query = %{
      select city_id, feature_class, count(distinct feature_id) from (
        select * from modified_features_geo where user_id = #{user_id} union select * from modified_features_props where user_id = #{user_id}) as modified_features
        group by city_id, feature_class
    }

    DB.fetch(modified_features_query).each do |modified_feature|
      city_id = modified_feature[:city_id]
      h[city_id] ||= {}
      h[city_id][:modified_features] ||= {section_count: 0, station_count: 0}

      key = "#{modified_feature[:feature_class].downcase}_count".to_sym
      h[city_id][:modified_features][key] = modified_feature[:count]
    end

    # TODO:
    # - Removed Features

    h
  end
end
