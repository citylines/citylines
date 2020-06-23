require 'naturally'

module CityHelpers
  def city_lines(city)
    lines = city.lines.map { |line|
      { name: line.name,
        url_name: line.url_name,
        color: line.color,
        deletable: line.sections.count == 0 && line.stations.count == 0,
        system_id: line.system_id,
        transport_mode_id: line.transport_mode_id
      }
    }

    Naturally.sort_by(lines){|line| line[:name]}
  end

  def city_systems(city)
    systems = city.systems.map{|system| {id: system.id, name: system.name}}
    Naturally.sort_by(systems){|system| system[:name]}
  end

  def lines_length_by_year(city)
    lengths = {}

    start_range = city.start_year
    end_range = DateTime.now.year

    Section.where(city_id: city.id).select(:id, :buildstart, :closure, :opening, :length).all.each do |section|
      from = if section.buildstart
               section.buildstart.to_i
             elsif section.opening
               section.opening.to_i
             else
               start_range
             end

      if from < start_range
        from = start_range
      end

      to = if section.closure && section.closure.to_i < end_range
             section.closure.to_i
           else
             end_range
           end

      lines = section.lines.map(&:url_name)

      (from..to).each do |year|
        lengths[year] ||= {}
        if section.buildstart && section.buildstart.to_i <= year && (!section.opening || section.opening.to_i > year)
          lengths[year][section.id] ||= {
            lines: lines
          }
          lengths[year][section.id][:under_construction] = section.length
        elsif section.opening && section.opening.to_i <= year && (!section.closure || section.closure.to_i > year)
          lengths[year][section.id] ||= {
            lines: lines
          }
          lengths[year][section.id][:operative] = section.length
        end
      end
    end
    lengths
  end

  def feature_lines_query(city, type)
    klass = type == 'sections' ? SectionLine : StationLine
    klass.where(city_id: city.id)
  end

  def features_query(city, type)
    klass = type == 'sections' ? Section : Station
    klass.where(city_id: city.id)
  end

  def formatted_lines_features_collection(city, type)
    klass = type == 'sections' ? FeatureCollection::Section : FeatureCollection::Station
    klass.by_city(city.id, formatted: true)
  end

  def lines_features_collection(city, type)
    klass = type == 'sections' ? FeatureCollection::Section : FeatureCollection::Station
    klass.by_city(city.id)
  end

  def city_contributors(city)
    ModifiedFeatureProps.where(city_id: city.id).select(:user_id).union(
      ModifiedFeatureGeo.where(city_id: city.id).select(:user_id)).union(
        CreatedFeature.where(city_id: city.id).select(:user_id)).union(
          DeletedFeature.where(city_id: city.id).select(:user_id)).count(:user_id)
  end

  def contributors
    query = %{
      select city_id, count(user_id) from
        (select distinct city_id, user_id from
          (select city_id, user_id from modified_features_props union
           select city_id, user_id from created_features union
           select city_id, user_id from deleted_features union
           select city_id, user_id from modified_features_geo) as modifications
        ) as different
      group by (city_id)
    }

    cities = {}

    DB.fetch(query).each do |register|
      cities[register[:city_id]] = register[:count]
    end

    cities
  end

  def lengths
    today = Time.now.year

    query = %{
      select sum(length), city_id from sections where
        sections.opening is not null and sections.opening <= #{today} and (sections.closure is null or sections.closure > #{today})
      group by city_id}

    cities = {}

    DB.fetch(query).each do |register|
      cities[register[:city_id]] = (register[:sum] / 1000).to_i
    end

    cities
  end

  def top_systems
    today = Time.now.year

    query = System
      .join(:lines, system_id: :systems__id)
      .join(:section_lines, line_id: :lines__id)
      .join(:sections, id: :section_id)
      .where{(sections__opening !~ nil) & (sections__opening <= today) & ((sections__closure =~ nil) | (sections__closure > today))}
      .select_group(:systems__id, :systems__name, :systems__city_id)
      .select_append{sum(:length).as(:sum)}
      .order(Sequel.desc(:sum))

    query.limit(10).all.map do |row|
      {
        name: row.name,
        url: row.url,
        length: (row[:sum] / 1000).to_i,
        city_name: row.city.name
      }
    end
  end
end
