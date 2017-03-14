module FeatureBackup
  def backup!
    klass = self.is_a?(Section) ? SectionBackup : StationBackup
    values = self.values.clone

    values.delete(:created_at)
    values.delete(:updated_at)
    values[:original_id] = values.delete(:id)

    klass.create(values)
  end
end
