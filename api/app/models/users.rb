class User < Sequel::Model
  plugin :timestamps, :update_on_create => true

  def initials
    parts = self.name.split(" ")
    res = unless parts[1].blank?
            parts[0][0] + parts[1][0]
          else
            parts[0][0..1]
          end
    res.upcase
  end
end
