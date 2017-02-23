module StartYear
  def after_save
    year = self.buildstart || self.opening
    if year < self.city.start_year && year > 1800
      self.city.start_year = year
      self.city.save
    end
  end
end
