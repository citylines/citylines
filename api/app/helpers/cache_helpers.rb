module CacheHelpers
  def last_modified_city_date
    [Section.max(:updated_at), System.max(:updated_at)].max
  end
end
