module OSMHelpers
  def get_osm_features_collection(city,route,s,n,w,e)
    elements = fetch_osm_elements(route,s,n,w,e)

    features = elements.map do |element|
        build_osm_feature(element)
    end

    features = filter_out_existing_features(city, features)

    {type: "FeatureCollection",
     features: features}
  end

  def rejectable_member?(member)
    (member[:type] == "node" && (!member[:tags] || (member[:tags] && member[:tags][:public_transport]!= "stop_position"))) ||
    (member[:type] == "way" && member[:tags] &&
    (member[:tags][:area] == "yes" ||
     member[:tags][:public_transport] == "platform"))
  end

  def fetch_osm_elements(route,s,n,w,e)
    require 'overpass_api_ruby'

    bbox = {s: s, n: n, w: w, e: e}

    options={bbox: bbox,
             timeout: 900,
             maxsize: 1073741824}

    overpass = OverpassAPI::QL.new(options)

    bbox2=[bbox[:s], bbox[:w], bbox[:n], bbox[:e]].join(',');
    query ="rel['route'='#{route}'];(way(r)(#{bbox2}); node(r)(#{bbox2}););(._;>;); out body;"

    response = overpass.query(query)

    nodes = response[:elements].select{|e| e[:type] == "node"}

    ways = response[:elements].select{|e| e[:type] == "way"}.map {|way|
      way[:nodes] = way[:nodes].map {|node_id|
        nodes.find{|n| n[:id] == node_id}
      }
      way
    }

    (nodes + ways).reject {|e| rejectable_member?(e)}
  end

  def build_osm_feature(element)
    type = element[:type]

    geometry = {type: type == 'node' ? 'Point' : 'LineString'}
    geometry[:coordinates] = if type == 'node'
                               [element[:lon], element[:lat]]
                             else
                               element[:nodes].map {|node| [node[:lon], node[:lat]]}
                             end
    properties = {
      osm_id: element[:id],
      osm_tags: element[:tags].to_json
    }

    if type == "node" && element[:tags] && element[:tags][:name]
      properties[:name] = element[:tags][:name]
    end

    {
     type: "Feature",
     properties: properties,
     geometry: geometry
    }
  end

  def filter_out_existing_features(city, features)
    sections_osm_ids = Line.where(city_id: city.id).right_join(:sections, :sections__line_id => :lines__id).exclude(osm_id: nil).select_map(:sections__osm_id)
    stations_osm_ids = Line.where(city_id: city.id).right_join(:stations, :stations__line_id => :lines__id).exclude(osm_id: nil).select_map(:stations__osm_id)

    features.reject {|feature|
      type = feature[:geometry][:type]
      osm_id = feature[:properties][:osm_id]

      (type == 'Point' && stations_osm_ids.include?(osm_id)) ||
        (type == 'LineString' && sections_osm_ids.include?(osm_id))
    }
  end
end
