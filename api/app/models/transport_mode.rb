class TransportMode < Sequel::Model
  plugin :timestamps, :update_on_create => true

  def self.summary
    self.select(:id, :name, :width, :min_width).all.map(&:values)
  end
end
