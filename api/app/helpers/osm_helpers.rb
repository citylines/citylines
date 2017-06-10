module OSMHelpers
  def get_osm_features_collection(route,s,n,w,e)
    relations = fetch_osm_relations(route,s,n,w,e)

    features = relations.map do |relation|
      relation[:members].map{|e|
        # TODO: add information about the relation to set the line
        build_osm_feature(e)
      }
    end.flatten

    {type: "FeatureCollection",
     features: features}
  end

  def fetch_osm_relations(route,s,n,w,e)
    require 'overpass_api_ruby'

    options={:bbox => {s: s, n: n,
                       w: w, e: e},
                       :timeout => 900,
                       :maxsize => 1073741824}

    overpass = OverpassAPI::QL.new(options)

    query = "rel['route'='#{route}'];(._;>;);out body;"

    response = overpass.query(query)

    nodes = response[:elements].select{|e| e[:type] == "node"}

    data = {
      node: nodes,
      way: response[:elements].select{|e| e[:type] == "way"}.map {|way|
        way[:nodes] = way[:nodes].map {|node_id|
          nodes.find{|n| n[:id] == node_id}
        }
        way
      }
    }

    relations = response[:elements].select{|e| e[:type] == "relation"}

    relations.map {|relation|
      relation[:members] = relation[:members].map do |member|
        type = member[:type]
        data[type.to_sym].find{|e| e[:id] == member[:ref]}
      end

      relation
    }
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
end
