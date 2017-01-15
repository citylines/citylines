module CityHelpers
  def city_lines(city)
    city.lines.map { |line|
      { name: line.name,
        url_name: line.url_name,
        style: line.style }
    }
  end
=begin
  def city_plans(city, params)
    param_plan_lines = params[:plans] ? params[:plans].split(',') : []

    plans = {}

    city.plans
    .sort_by{ |plan| plan.extra["year"].to_i }
    .each { |plan|
      lines = plan.plan_lines.map {|line|
        {show: param_plan_lines.include?(line.parent_url_name),
         parent_url_name: line.parent_url_name,
         name: line.name,
         style: line.style}
      }
      plans[plan.name]= {
        lines: lines,
        year: plan.extra["year"],
        url: plan.extra["url"]
      }
    }
    plans
  end

  def lines_length_by_year(city)
    lengths = {}
    years_range = (city.start_year..DateTime.now.year)
    line_ids = Line.where(city_id: city.id).select_map(:id)
    Section.where(line_id: line_ids).each do |section|
      years_range.each do |year|
        lengths[year] ||= {}
        line = section.line.url_name
        if section.buildstart && section.buildstart.to_i <= year && (!section.opening || section.opening.to_i > year)
          lengths[year][line] ||= {}
          lengths[year][line][:under_construction] ||= 0
          lengths[year][line][:under_construction] += section.length
        elsif section.opening && section.opening.to_i <= year && (!section.closure || section.closure.to_i > year)
          lengths[year][line] ||= {}
          lengths[year][line][:operative] ||= 0
          lengths[year][line][:operative] += section.length
        end
      end
    end
    lengths
  end

  def plans_length(city)
    lengths = {}
    plan_ids = Plan.where(city_id: city.id).select_map(:id)
    PlanLine.where(plan_id: plan_ids).each do |line|
      lengths[line.parent_url_name] = line.length
    end
    lengths
  end
=end

  def lines_features_collection(city, type)
    city_lines_ids = city.lines.map(&:id)
    query = {line_id: city_lines_ids}

    features = if type == 'sections'
                 Section.where(query).map(&:feature)
               else
                 Station.where(query).map(&:feature)
               end

    {type: "FeatureCollection",
     features: features}
  end
end
