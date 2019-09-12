require File.expand_path '../../../test_config', __FILE__

describe OSMHelpers do
  require 'overpass_api_ruby'
  include OSMHelpers

  describe "rejectable member" do
    it "should reject the node by default" do
      assert rejectable_member?(type: "node")
    end

    it "shouldn't reject the node only if it is a stop" do
      assert rejectable_member?(type: "node", tags: {transport_public: "stop_position"})
    end

    it "shouldn't reject the way by default" do
      refute rejectable_member?(type: "way")
    end

    it "should reject a way and if it's an area or a plarform" do
      assert rejectable_member?(type: "way", tags: {area: "yes"})
      assert rejectable_member?(type: "way", tags: {public_transport: "platform"})
    end
  end

  describe "fetch_osm_elements" do
    it "should call the OverpassAPI" do
      s = 1
      n = 2
      w = 3
      e = 4

      options={:bbox => {s: s, n: n,
                         w: w, e: e},
                         :timeout => 900,
                         :maxsize => 1073741824}
      route = "subway"

      response = {elements: []}

      instance = mock

      OverpassAPI::QL
        .expects(:new)
        .with(options)
        .returns(instance)

      bbox2=[s,w,n,e].join(',');
      query ="rel['route'='#{route}'];(way(r)(#{bbox2}); node(r)(#{bbox2}););(._;>;); out meta;"

      instance
        .expects(:query)
        .with(query)
        .returns(response)

      fetch_osm_elements(route, s, n, w, e)
    end

    it "should set the geometries in the ways" do
      response = {
        elements: [
          {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station", public_transport: "stop_position"}},
          {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
          {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776},
          {type: "way",  id: 26192812, nodes: [81551276, 81869946]}
        ]
      }

      OverpassAPI::QL.any_instance.stubs(:query).returns(response)

      elements = fetch_osm_elements("subway", 1, 2, 3, 4)

      assert_equal 2, elements.count

      # check nodes
      assert_equal 1, elements.select{|element| element[:type] === "node"}.count

      # check way
      way = elements.last
      assert_equal "way", way[:type]

      expected_nodes = [
        {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
        {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776}
      ]

      assert_equal expected_nodes, way[:nodes]
    end

    it "shouldn't include the rejectable members" do
      response = {
        elements: [
          {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station", public_transport: "stop_position"}},
          {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
          {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776},
          {type: "way",  id: 26192812, nodes: [81551276, 81869946]},
          {type: "way", id: 4444444, nodes: [], tags: {area: "yes"}}
        ]
      }

      OverpassAPI::QL.any_instance.stubs(:query).returns(response)

      elements = fetch_osm_elements("subway", 1, 2, 3, 4)

      assert_equal 2, elements.count

      # check nodes
      assert_equal 1, elements.select{|element| element[:type] === "node"}.count

      # check way
      way = elements.last
      assert_equal "way", way[:type]

      expected_nodes = [
        {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
        {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776}
      ]

      assert_equal expected_nodes, way[:nodes]
    end
  end

  describe "build_osm_feature" do
    it "should build a Point feature from a node" do
      node = {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station"}, version: 2}

      feature = build_osm_feature(node)

      expected_feature = {
        type: "Feature",
        properties: {osm_id: 81551275, osm_tags: {name: "Test Station"}.to_json, name: "Test Station", osm_metadata: {version: 2}.to_json},
        geometry: {
          type: "Point",
          coordinates: [-58.4059239, -34.6065585]
        }
      }

      assert_equal expected_feature, feature
    end

    it "should build a LineString from a way" do
      way = {type: "way", id: 26192812, nodes: [
              {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
              {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776},
            ], tags: {electrified: "contact_line"}, version: 2}

      feature = build_osm_feature(way)

      expected_feature = {
        type: "Feature",
        properties: {osm_id: 26192812, osm_tags: {electrified: "contact_line"}.to_json, osm_metadata: {version: 2}.to_json},
        geometry: {
          type: "LineString",
          coordinates: [[-58.4061094, -34.6077615], [-58.4620776, -34.5855604]]
        }
      }

      assert_equal expected_feature, feature
    end
  end

  it "should build the right features collection" do
    city = City.create(name: 'Test city', url_name:'test-city')

      response = {
        elements: [
          {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station", public_transport: "stop_position"}, version: 1},
          {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
          {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776},
          {type: "way",  id: 26192812, nodes: [81551276, 81869946], version: 2}
        ]
      }

    OverpassAPI::QL.any_instance.stubs(:query).returns(response)

    feature_collection = get_osm_features_collection(city, "subway", 1, 2, 3, 4)

    expected_features = [
      {
        type: "Feature",
        properties: {osm_id: 81551275, osm_tags: {name: "Test Station", public_transport: "stop_position"}.to_json, name: "Test Station", osm_metadata: {version: 1}.to_json},
        geometry: {
          type: "Point",
          coordinates: [-58.4059239, -34.6065585]
        }
      },
      {
        type: "Feature",
        properties: {osm_id: 26192812, osm_tags: "null", osm_metadata: {version: 2}.to_json},
        geometry: {
          type: "LineString",
          coordinates: [[-58.4061094, -34.6077615], [-58.4620776, -34.5855604]]
        }
      }
    ]

    expected_feature_collection = {
      type: "FeatureCollection",
      features: expected_features
    }

    assert_equal expected_feature_collection, feature_collection
  end

  describe "filter_out_existing_features" do
    before do
      @city = City.create(name: 'Test city', url_name:'test-city')
    end

    it "should filter out any existing station" do
      Station.create(osm_id: 81551275, city_id: @city.id)

      response = {
        elements: [
          {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station", public_transport: "stop_position"}},
          {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
          {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776},
          {type: "way",  id: 26192812, nodes: [81551276, 81869946], version: 1}
        ]
      }

      OverpassAPI::QL.any_instance.stubs(:query).returns(response)

      feature_collection = get_osm_features_collection(@city, "subway", 1, 2, 3, 4)

      expected_features = [
        {
          type: "Feature",
          properties: {osm_id: 26192812, osm_tags: "null", osm_metadata: {version: 1}.to_json},
          geometry: {
            type: "LineString",
            coordinates: [[-58.4061094, -34.6077615], [-58.4620776, -34.5855604]]
          }
        }
      ]

      expected_feature_collection = {
        type: "FeatureCollection",
        features: expected_features
      }

      assert_equal expected_feature_collection, feature_collection
    end

    it "should filter out any existing section" do
      Section.create(osm_id: 26192812, city_id: @city.id)

      response = {
        elements: [
          {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station", public_transport: "stop_position"}, version: 2},
          {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
          {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776},
          {type: "way",  id: 26192812, nodes: [81551276, 81869946]}
        ]
      }

      OverpassAPI::QL.any_instance.stubs(:query).returns(response)

      feature_collection = get_osm_features_collection(@city, "subway", 1, 2, 3, 4)

      expected_features = [
        {
          type: "Feature",
          properties: {osm_id: 81551275, osm_tags: {name: "Test Station", public_transport: "stop_position"}.to_json, name: "Test Station", osm_metadata: {version: 2}.to_json},
          geometry: {
            type: "Point",
            coordinates: [-58.4059239, -34.6065585]
          }
        }
      ]

      expected_feature_collection = {
        type: "FeatureCollection",
        features: expected_features
      }

      assert_equal expected_feature_collection, feature_collection
    end
  end

  describe "geometry_validation" do
    before do
      @city = City.create(name: 'Test city', url_name:'test-city')
    end

    it "should filter out any invalid geometry" do
      # The following feature is invalid because it is a way and it has only one node
      response = {
        elements: [
          {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
          {type: "way",  id: 26192812, nodes: [81551276]}
        ]
      }

      OverpassAPI::QL.any_instance.stubs(:query).returns(response)

      feature_collection = get_osm_features_collection(@city, "subway", 1, 2, 3, 4)

      assert feature_collection[:features].empty?
    end
  end
end
