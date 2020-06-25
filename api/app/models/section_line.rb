class SectionLine < Sequel::Model
  plugin :timestamps, :update_on_create => true
  one_through_one :system, join_table: :lines, left_key: :id, left_primary_key: :line_id

  def after_create
    super

    self.system.compute_length
    self.system.save
  end

  def after_destroy
    super

    self.system.compute_length
    self.system.save
  end
end
