class User < Sequel::Model
  plugin :timestamps, :update_on_create => true

  def default_nickname
    self.name.split(" ").first
  end

  def nickname
    default_nickname
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
end
