class SectionLine < Sequel::Model
  plugin :timestamps, :update_on_create => true
  many_to_one :section
  many_to_one :line

  def after_create
    super

    self.line.system.compute_length
    self.line.system.save
  end

  def after_destroy
    super

    self.line.system.compute_length
    self.line.system.save
  end
end
