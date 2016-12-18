class Plan < Sequel::Model(:plans)
    many_to_one :city
    one_to_many :plan_lines

    def set_year(year)
        self.extra ||= {}
        self.extra["year"] = year
    end

    def set_url(url)
        self.extra ||= {}
        self.extra["url"] = url
    end
end
