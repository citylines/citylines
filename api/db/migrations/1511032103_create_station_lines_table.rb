Sequel.migration do
  change do
    create_table(:station_lines) do
      primary_key :id
      Integer :station_id, null: false, index: true
      Integer :line_id, null: false
      Integer :city_id, null: false, index: true
      DateTime :created_at
      DateTime :updated_at
    end

    from(:stations).each do |station|
      from(:station_lines).insert(station_id: station[:id], line_id: station[:line_id], city_id: station[:city_id])
    end

    drop_column :stations, :line_id
  end
end
