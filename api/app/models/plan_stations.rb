class PlanStation < Sequel::Model(:plan_stations)
    many_to_one :plan_line

    plugin :geometry

    def feature
        h = super
        h[:properties].merge!({plan: self.plan_line.plan.name,
                               line: self.plan_line.name,
                               line_url_name: self.plan_line.url_name,
                               line_parent_url_name: self.plan_line.parent_url_name,
                               name: self.name,
                               year: self.plan_line.plan.extra["year"],
                               url: self.plan_line.plan.extra["url"]})
        h
    end
end
