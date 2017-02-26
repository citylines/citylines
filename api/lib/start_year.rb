module StartYear
  def after_save
    year = [self.buildstart, self.opening].select{|y| y.is_a?(Numeric) && y > 0}.min

    if year && year < self.city.start_year && year > 1800
      self.city.start_year = year
      self.city.save
    end
  end
end
