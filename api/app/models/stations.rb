class Station < Sequel::Model(:stations)
  plugin :timestamps, :update_on_create => true

  include StartYear
  include FeatureBackup

  one_to_many :station_lines
  many_to_one :city

  plugin :geometry

  SHARED_STATION_LINE_URL_NAME = "shared-station"

  def lines
    @lines ||= station_lines.map(&:line)
  end

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
       system: l.system.name || ''}
    end
  end

  def feature
    h = super

    closure = self.closure || Section::FUTURE

    opts = {line_url_name: line_url_name,
            lines: lines_data,
            name: self.name,
            opening: self.opening || Section::FUTURE,
            buildstart: self.buildstart || self.opening,
            buildstart_end: self.opening || closure,
            osm_id: self.osm_id,
            osm_tags: self.osm_tags,
            closure: closure }

    # We add other line_url_name attrs if the station is shared
    # so the original url_name refers to style, and the following ones
    # are use by the client's filter function
    if shared_station?
      lines.each_with_index do |line, i|
        opts["line_url_name_#{i + 1}".to_sym] = line.url_name
      end
    end

    h[:properties].merge!(opts)

    h
  end

  def raw_feature
    feature
  end

  def formatted_feature
    feature
  end
end
