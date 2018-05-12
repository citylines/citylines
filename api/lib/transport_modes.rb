module TransportModes
  TRANSPORT_MODES = {
    0 => { name: 'Default', width: 6, min_width: 6},
    1 => { name: 'High Speed', width: 9, min_width: 3},
    2 => { name: 'Interurban train', width: 8, min_width: 3},
    3 => { name: 'Commuter train', width: 7, min_width: 2},
    4 => { name: 'Heavy Metro', width: 6, min_width: 2},
    5 => { name: 'Light Rail', width: 4, min_width: 2},
    6 => { name: 'BRT', width: 4, min_width: 1},
    7 => { name: 'People mover', width: 3, min_width: 2},
    8 => { name: 'Bus', width: 1, min_width: 1},
  }

  def self.all
    TRANSPORT_MODES.each_pair.map{|k, v| v.merge(id: k)}
  end
end
