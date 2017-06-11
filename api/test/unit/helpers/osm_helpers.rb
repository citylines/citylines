require File.expand_path '../../../test_config', __FILE__

describe OSMHelpers do
  require 'overpass_api_ruby'
  include OSMHelpers

  describe "rejectable member" do
    it "shouldn't reject the member by default" do
      refute rejectable_member({type: "node"})

      refute rejectable_member({type: "way"})
    end

    it "should reject the member if it's a way and is an area or a plarform" do
      assert rejectable_member({type: "way", tags: {area: "yes"}})
      assert rejectable_member({type: "way", tags: {public_transport: "platform"}})
    end
  end

  describe "fetch_osm_relations" do
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

      instance
        .expects(:query)
        .with("rel['route'='#{route}'];(._;>;);out body;")
        .returns(response)

      fetch_osm_relations(route, s, n, w, e)
    end

    it "should set the geometries in the relations array" do
      response = {
        elements: [
          {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station"}},
          {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
          {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776},
          {type: "way",  id: 26192812, nodes: [81551276, 81869946]},
          {type: "relation", id: "77777777", members: [
            {type: "node", ref: 81551275, role: "stop"},
            {type: "way",  ref: 26192812, role:""}
          ], tags: {name: "Test Line 1"}}
        ]
      }

      OverpassAPI::QL.any_instance.stubs(:query).returns(response)

      relations = fetch_osm_relations("subway", 1, 2, 3, 4)

      assert_equal 1, relations.count
      relation = relations.first

      assert_equal "77777777", relation[:id]

      expected_tags = {name: "Test Line 1"}
      assert_equal expected_tags, relation[:tags]

      expected_members = [
        {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station"}},
        {type: "way", id: 26192812, nodes: [
          {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
          {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776},
        ]}
      ]

      assert_equal expected_members, relation[:members]
    end

    it "shouldn't include the rejectable members" do
      response = {
        elements: [
          {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station"}},
          {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
          {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776},
          {type: "way",  id: 26192812, nodes: [81551276, 81869946], tags:{"area":"yes"}},
          {type: "relation", id: "77777777", members: [
            {type: "node", ref: 81551275, role: "stop"},
            {type: "way",  ref: 26192812, role:""}
          ], tags: {name: "Test Line 1"}}
        ]
      }

      OverpassAPI::QL.any_instance.stubs(:query).returns(response)

      relations = fetch_osm_relations("subway", 1, 2, 3, 4)

      assert_equal 1, relations.count
      relation = relations.first

      assert_equal "77777777", relation[:id]

      expected_tags = {name: "Test Line 1"}
      assert_equal expected_tags, relation[:tags]

      expected_members = [
        {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station"}}
      ]

      assert_equal expected_members, relation[:members]
    end

    it "shouldn't ignore nested relations" do
      response = {
        elements: [
          {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station"}},
          {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
          {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776},
          {type: "way",  id: 26192812, nodes: [81551276, 81869946]},
          {type: "relation", id: "77777777", members: [
            {type: "relation", ref: 12345678, role: ""},
            {type: "node", ref: 81551275, role: "stop"},
            {type: "way",  ref: 26192812, role:""}
          ], tags: {name: "Test Line 1"}}
        ]
      }

      OverpassAPI::QL.any_instance.stubs(:query).returns(response)

      relations = fetch_osm_relations("subway", 1, 2, 3, 4)

      assert_equal 1, relations.count
      relation = relations.first

      assert_equal "77777777", relation[:id]

      expected_tags = {name: "Test Line 1"}
      assert_equal expected_tags, relation[:tags]

      expected_members = [
        {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station"}},
        {type: "way", id: 26192812, nodes: [
          {type: "node", id: 81551276, lat: -34.6077615, lon: -58.4061094},
          {type: "node", id: 81869946, lat: -34.5855604, lon: -58.4620776},
        ]}
      ]

      assert_equal expected_members, relation[:members]
    end
  end

  describe "build_osm_feature" do
    it "should build a Point feature from a node" do
      node = {type: "node", id: 81551275, lat: -34.6065585, lon: -58.4059239, tags: {name: "Test Station"}}

      feature = build_osm_feature(node)

      expected_feature = {
        type: "Feature",
        properties: {osm_id: 81551275, osm_tags: {name: "Test Station"}.to_json, name: "Test Station"},
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
            ], tags: {electrified: "contact_line"}}

      feature = build_osm_feature(way)

      expected_feature = {
        type: "Feature",
        properties: {osm_id: 26192812, osm_tags: {electrified: "contact_line"}.to_json},
        geometry: {
          type: "LineString",
          coordinates: [[-58.4061094, -34.6077615], [-58.4620776, -34.5855604]]
        }
      }

      assert_equal expected_feature, feature
    end
  end

  it "should build the right features collection" do
    self.stubs(:build_osm_feature).with('feature_1').returns("built_feature_1")
    self.stubs(:build_osm_feature).with('feature_2').returns("built_feature_2")
    self.stubs(:build_osm_feature).with('feature_3').returns("built_feature_3")

    rel1 = {members: ['feature_1']}
    rel2 = {members: ['feature_2']}
    rel3 = {members: ['feature_3']}

    self.stubs(:fetch_osm_relations).returns([rel1, rel2, rel3])

    feature_collection = get_osm_features_collection("subway", 1, 2, 3, 4)

    expected_feature_collection = {
      type: "FeatureCollection",
      features: %w{built_feature_1 built_feature_2 built_feature_3}
    }

    assert_equal expected_feature_collection, feature_collection
  end
end
