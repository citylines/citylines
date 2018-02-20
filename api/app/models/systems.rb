require "accentless"

class System < Sequel::Model
  plugin :timestamps, :update_on_create => true
  include FeatureBackup

  using Accentless

  many_to_one :city
  one_to_many :lines

  def generate_url_name
    system_name = self.name || 'unnamed'
    self.url_name = "#{self.id}-#{system_name.strip.accentless.gsub(/\s|\//,'-').downcase}"
  end
end
