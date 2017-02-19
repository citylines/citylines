module ModifiedFeature
  def push(user, feature)
    self.create(user_id: user.id,
                city_id: feature.city.id,
                feature_class: feature.class.name,
                feature_id: feature.id)
  end
end
