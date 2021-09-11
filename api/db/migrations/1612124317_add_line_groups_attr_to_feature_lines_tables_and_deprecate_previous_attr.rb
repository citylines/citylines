include LineGroupHelpers

Sequel.migration do
  up do
    create_table(:section_line_groups) do
      primary_key :id
      foreign_key :section_line_id, :section_lines, index: true
      Integer     :line_group, null: false
      Integer     :from
      Integer     :to
      DateTime    :created_at
      DateTime    :updated_at
    end

    create_table(:station_line_groups) do
      primary_key :id
      foreign_key :station_line_id, :station_lines, index: true
      Integer     :line_group, null: false
      Integer     :from
      Integer     :to
      DateTime    :created_at
      DateTime    :updated_at
    end

    [:section_lines, :station_lines].each do |feature_lines_table|
      alter_table feature_lines_table do
        rename_column :line_group, :deprecated_line_group
      end

      if feature_lines_table == :section_lines
        attr = :section_id
        groups_table = :section_line_groups
        foreign_attr = :section_line_id
      else
        attr = :station_id
        groups_table = :station_line_groups
        foreign_attr = :station_line_id
      end

      feature_ids = from(feature_lines_table).distinct(attr).select(attr).all.map{|r| r[attr]}
      feature_ids.each do |feature_id|
        get_line_groups_data_for_feature(from(feature_lines_table), feature_id, attr) do |feature_line_id, line_group, from, to|
          from(groups_table).insert(
            foreign_attr => feature_line_id,
            :line_group => line_group,
            :from => from,
            :to => to,
          )
        end
      end
    end
  end

  down do
    [:section_lines, :station_lines].each do |feature_lines_table|
      alter_table feature_lines_table do
        rename_column :deprecated_line_group, :line_group
      end
    end
    drop_table :section_line_groups
    drop_table :station_line_groups
  end
end