Sequel.migration do
  up do
    alter_table :systems do
      add_column :contributors, Integer, default: 0
    end

    alter_table :system_backups do
      add_column :contributors, Integer, default: 0
    end

    query = %{
      select system_id, count(distinct user_id) from
        (
          select system_id, user_id from lines
            inner join section_lines on section_lines.line_id = lines.id
            inner join modified_features_props on feature_id = section_id
            where feature_class = 'Section' union
          select system_id, user_id from lines
            inner join section_lines on section_lines.line_id = lines.id
            inner join modified_features_geo on feature_id = section_id
            where feature_class = 'Section' union
          select system_id, user_id from lines
            inner join section_lines on section_lines.line_id = lines.id
            inner join created_features on feature_id = section_id
            where feature_class = 'Section' union

          select system_id, user_id from lines
            inner join station_lines on station_lines.line_id = lines.id
            inner join modified_features_props on feature_id = station_id
            where feature_class = 'Station' union
          select system_id, user_id from lines
            inner join station_lines on station_lines.line_id = lines.id
            inner join modified_features_geo on feature_id = station_id
            where feature_class = 'Station' union
          select system_id, user_id from lines
            inner join station_lines on station_lines.line_id = lines.id
            inner join created_features on feature_id = station_id
            where feature_class = 'Station'
        ) as modifications
      group by (system_id);
    }

    DB.fetch(query).each do |r|
      from(:systems).where(id: r[:system_id]).update(contributors: r[:count])
    end
  end

  down do
    alter_table :systems do
      drop_column :contributors
    end

    alter_table :system_backups do
      drop_column :contributors
    end
  end
end
