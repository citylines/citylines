module OSMHelpers
  def fetch_osm_relations(route,s,n,w,e)
    require 'overpass_api_ruby'

    options={:bbox => {s: s, n: n,
                       w: w, e: e},
                       :timeout => 900,
                       :maxsize => 1073741824}

    overpass = OverpassAPI::QL.new(options)

    query = "rel['route'='#{route}'];(._;>;);out body;"

    response = overpass.query(query)

    response[:elements].select{|e| e[:type] == "relation"}
  end
end
