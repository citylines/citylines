require 'accentless'

class Line < Sequel::Model(:lines)
  plugin :timestamps, :update_on_create => true
  using Accentless

  include FeatureBackup

  many_to_one :city
  one_to_many :sections
  one_to_many :stations

  def style
    self.city.style["line"]["opening"][self.url_name]
  end

  def color
    style["color"]
  end

  def generate_url_name
    self.url_name = "#{self.id}-#{self.name.strip.accentless.gsub(/\s|\//,'-').downcase}"
  end
end
