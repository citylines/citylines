Sequel.migration do
  up do
    create_table(:transport_modes) do
      primary_key :id
      String      :name, null: false
      Integer     :width, null: false
      Integer     :min_width, null: false
      DateTime    :created_at
      DateTime    :updated_at
    end

    current_transport_modes = {
      0 => { name: 'default', width: 6, min_width: 2},
      1 => { name: 'high_speed_rail', width: 9, min_width: 3},
      2 => { name: 'inter_city_rail', width: 8, min_width: 3},
      3 => { name: 'commuter_rail', width: 7, min_width: 2},
      4 => { name: 'heavy_rail', width: 6, min_width: 2},
      5 => { name: 'light_rail', width: 4, min_width: 2},
      6 => { name: 'brt', width: 4, min_width: 1},
      7 => { name: 'people_mover', width: 3, min_width: 2},
      8 => { name: 'bus', width: 1, min_width: 1},
      9 => { name: 'tram', width: 3, min_width: 1},
      10 => { name: 'ferry', width: 3, min_width: 1},
    }

    current_transport_modes.each_pair do |id, vals|
      timestamp = Time.now
      from(:transport_modes).insert(
        id: id,
        name: vals[:name],
        width: vals[:width],
        min_width: vals[:min_width],
        created_at: timestamp,
        updated_at: timestamp
      )
    end
  end

  down do
    drop_table :transport_modes
  end
end
