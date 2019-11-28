require 'digest'

class User < Sequel::Model
  plugin :timestamps, :update_on_create => true

  def default_nickname
    self.name.split(" ").first
  end

  def nickname
    self.custom_name.blank? ? default_nickname : self.custom_name
  end

  def initials
    parts = self.name.split(" ")

    # The default nickname is the first name
    if parts.first != nickname then
      parts = self.nickname.split(" ")
    end

    res = unless parts[1].blank?
            parts[0][0] + parts[1][0]
          else
            parts[0][0..1]
          end

    res.upcase
  end

  def set_gravatar_img
    hashed_email = Digest::MD5.hexdigest(self.email.strip.downcase)
    size=120
    url = "https://www.gravatar.com/avatar/#{hashed_email}?s=#{size}"
    self.img_url = url
  end
end
