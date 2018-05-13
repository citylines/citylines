module TransportModes
  TRANSPORT_MODES = {
    0 => { name: 'default', width: 6, min_width: 6},
    1 => { name: 'high_speed_rail', width: 9, min_width: 3},
    2 => { name: 'inter_city_rail', width: 8, min_width: 3},
    3 => { name: 'commuter_rail', width: 7, min_width: 2},
    4 => { name: 'heavy_rail', width: 6, min_width: 2},
    5 => { name: 'light_rail', width: 4, min_width: 2},
    6 => { name: 'brt', width: 4, min_width: 1},
    7 => { name: 'people_mover', width: 3, min_width: 2},
    8 => { name: 'bus', width: 1, min_width: 1},
  }

  def self.all
    TRANSPORT_MODES.each_pair.map{|k, v| v.merge(id: k)}
  end
end
