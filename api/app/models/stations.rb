class Station < Sequel::Model(:stations)
  plugin :timestamps, :update_on_create => true

  include StartYear
  include FeatureBackup

  many_to_many :lines, join_table: :station_lines
  many_to_one :city

  plugin :geometry

  include Feature

  SHARED_STATION_LINE_URL_NAME = "shared-station"

  def shared_station?
    lines.count > 1
  end

  def line_url_name
    if shared_station?
      SHARED_STATION_LINE_URL_NAME
    elsif lines.first
      lines.first.url_name
    end
  end

  def lines_data
    lines.map do |l|
      {line: l.name,
       line_url_name: l.url_name,
       system: l.system.name || '',
       transport_mode_name: l.transport_mode[:name]
      }
    end
  end

  def feature_properties(**opts)
    closure = self.closure || Section::FUTURE

    data = {line_url_name: line_url_name,
            lines: lines_data,
            name: self.name,
            opening: self.opening || Section::FUTURE,
            buildstart: self.buildstart || self.opening,
            buildstart_end: self.opening || closure,
            osm_id: self.osm_id,
            osm_tags: self.osm_tags,
            closure: closure}

    if opts[:formatted]
      data.merge!(
        width: radius,
        inner_width: inner_radius
      )
    end

    # We add other line_url_name attrs if the station is shared
    # so the original url_name refers to style, and the following ones
    # are use by the client's filter function
    if shared_station?
      lines.each_with_index do |line, i|
        data["line_url_name_#{i + 1}".to_sym] = line.url_name
      end
    end

    super.merge(data)
  end

  def radius
    lines.map(&:width).max || 0
  end

  def inner_radius
    r = radius
    r < 4 ? 0 : r - 2
  end
end
