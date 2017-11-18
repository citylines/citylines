class SectionLine < Sequel::Model
  plugin :timestamps, :update_on_create => true
  many_to_one :section
  many_to_one :line
end
