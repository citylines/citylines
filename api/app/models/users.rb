require 'shield'

class User < Sequel::Model
  plugin :timestamps, :update_on_create => true

  include Shield::Model

  def self.fetch(email)
    self[email: email]
  end
end
