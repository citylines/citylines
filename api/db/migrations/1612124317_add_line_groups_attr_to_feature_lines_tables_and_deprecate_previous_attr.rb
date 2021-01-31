include LineGroupHelpers

Sequel.migration do
  up do
    [:section_lines, :station_lines].each do |feature_lines_table|
      alter_table feature_lines_table do
        add_column :line_groups, "int[]", default: [0]
        rename_column :line_group, :deprecated_line_group
      end

      attr = feature_lines_table == :section_lines ? :section_id : :station_id
      feature_ids = from(feature_lines_table).distinct(attr).select(attr).all.map{|r| r[attr]}
      feature_ids.each do |feature_id|
        feature_ranges = Hash[
          from(feature_lines_table).where(attr => feature_id).all.map do |feature_line|
            from = feature_line[:fromyear] || 0
            to = feature_line[:toyear] || FeatureCollection::Section::FUTURE
            [feature_line, from..to]
          end
        ]

        groups = compute_groups(feature_ranges.values)
        feature_ranges.each_pair do |feature_line, key|
          from(feature_lines_table).
            where(id: feature_line[:id]).
            update(line_groups: Sequel.pg_array(groups[key]))
        end
      end
    end
  end

  down do
    [:section_lines, :station_lines].each do |feature_lines_table|
      alter_table feature_lines_table do
        drop_column :line_groups
        rename_column :deprecated_line_group, :line_group
      end
    end
  end
end
