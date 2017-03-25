module FeatureBackup
  def backup!
    klass = Object.const_get("#{self.class}Backup")

    values = self.values.clone

    values.delete(:created_at)
    values.delete(:updated_at)
    values[:original_id] = values.delete(:id)

    backup = klass.create(values)
  end
end
