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

  def city_length(city)
    today = Time.now.year
    total = Section.
      where(city_id: city.id).
      exclude(opening: nil).
      where{opening <= today}.
      where{Sequel.|({closure: nil}, (closure > today))}.
      sum(:length)

    total.to_i
  end

  def system_contributors(system)
    #sections
    Line.where(system_id: system.id).
      left_join(:section_lines, line_id: :id).
      left_join(:modified_features_props, feature_id: :section_lines__section_id).
      where(feature_class: 'Section').select(:user_id).union(
        Line.where(system_id: system.id).
        left_join(:section_lines, line_id: :id).
        left_join(:modified_features_geo, feature_id: :section_lines__section_id).
        where(feature_class: 'Section').select(:user_id)).union(
        Line.where(system_id: system.id).
        left_join(:section_lines, line_id: :id).
        left_join(:created_features, feature_id: :section_lines__section_id).
        where(feature_class: 'Section').select(:user_id)).union(
          #stations
        Line.where(system_id: system.id).
        left_join(:station_lines, line_id: :id).
        left_join(:modified_features_props, feature_id: :station_lines__station_id).
        where(feature_class: 'Station').select(:user_id)).union(
        Line.where(system_id: system.id).
        left_join(:station_lines, line_id: :id).
        left_join(:modified_features_geo, feature_id: :station_lines__station_id).
        where(feature_class: 'Station').select(:user_id)).union(
        Line.where(system_id: system.id).
        left_join(:station_lines, line_id: :id).
        left_join(:created_features, feature_id: :station_lines__station_id).
        where(feature_class: 'Station').select(:user_id)).
      select(Sequel.function(:count, :user_id).distinct).first[:count]
  end

  def system_length(system)
    today = Time.now.year
    total = Line.where(system_id: system.id)
      .join(:section_lines, line_id: :lines__id)
      .join(:sections, id: :section_id)
      .where{(sections__opening !~ nil) & (sections__opening <= today) & ((sections__closure =~ nil) | (sections__closure > today))}
      .sum(:length)

    total.to_i
  end

  def search_city_or_system_by_term(term, page, page_size)
    opts = {
      from_self: false
    }

    query = City.where(Sequel.ilike(:name, "%#{term}%")).
      or(Sequel.ilike(:country, "%#{term}%")).
      select(:id,:name,:length,:contributors,Sequel.function(:concat,'/',:url_name).as(:url),:country,:country_state, Sequel.expr(nil).as(:city_name)).
      union(
        System.where(Sequel.ilike(:systems__name, "%#{term}%")).
        left_join(:cities, :id => :city_id).
        select(:systems__id,:systems__name,:systems__length,:systems__contributors,Sequel.function(:concat,'/', :cities__url_name,'?system_id=',:systems__id).as(:url),:cities__country,:cities__country_state,:cities__name), opts)

    query.order(Sequel.desc(:length), :name).
      paginate(page, page_size).all.map do |res|
      is_city = !res[:city_name]
      {
        name: res.name,
        city_name: res[:city_name],
        state: res.country_state,
        country: res.country,
        length: (res.length / 1000).to_i,
        systems: is_city ? res.systems.sort_by{|s| s.length}.reverse!.map(&:name).reject{|s| s.nil? || s == ''} : nil,
        contributors_count: res.contributors,
        url: res[:url]
      }
    end
  end
end
