require 'accentless'

class Line < Sequel::Model(:lines)
  plugin :timestamps, :update_on_create => true
  using Accentless

  include FeatureBackup

  many_to_one :city
  many_to_one :system

  def generate_url_name
    self.url_name = "#{self.id}-#{self.name.strip.accentless.gsub(/\s|\//,'-').downcase}"
  end
end
