require "./api/lib/length"
include Length

class PlanLine < Sequel::Model(:plan_lines)
    many_to_one :plan
    one_to_many :plan_stations

    plugin :geometry

    def city
        self.plan.city
    end

    def feature
        h = super
        h[:properties].merge!({line: self.name,
                               line_url_name: self.url_name,
                               line_parent_url_name: self.parent_url_name,
                               plan: self.plan.name,
                               url: self.plan.extra["url"],
                               year: self.plan.extra["year"],
                               length: self.length})
        h
    end

    def style
        self.plan.city.style["line"]["opening"][self.url_name]
    end

    def generate_url_name
      self.url_name = self.name.gsub(' ','-').downcase
      self.parent_url_name = [self.plan.name.gsub(' ','-').downcase, self.url_name].join('-')
    end
end
