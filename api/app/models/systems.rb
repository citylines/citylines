require 'addressable/uri'

class System < Sequel::Model
  plugin :timestamps, :update_on_create => true
  include FeatureBackup
  include CityHelpers

  many_to_one :city
  one_to_many :lines

  def url
    uri = Addressable::URI.parse(city.url)
    uri.query_values = {system_id: id}
    uri.to_s
  end

  def compute_length
    self.length = system_length(self)
  end
end
