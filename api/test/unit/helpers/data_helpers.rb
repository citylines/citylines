require File.expand_path '../../../test_config', __FILE__

describe DataHelpers do
  include DataHelpers

  describe '#city_lines_systems_and_modes' do
    let(:city)  { City.create(name: 'Stockholm', url_name: 'stockholm') }
    let(:system) { System.create(name: 'Tunnelbana', city_id: city.id) }
    let(:line1) {
      Line.create(
        name: 'L1',
        color: 'red',city_id: city.id,
        system_id: system.id,
        transport_mode_id: 4,
        url_name: 'l1'
      )
    }
    let(:line2) {
      Line.create(
        name: 'L2',
        color: 'green',
        city_id: city.id,
        system_id: system.id,
        transport_mode_id: 5,
        url_name: 'l2'
      )
    }

    it "should return the city lines, systems and modes data sorted naturally" do
      expected_line1 = {
        id: line1.id,
        name: 'L1',
        url_name: 'l1',
        color: 'red',
        system_id: system.id,
        system_name: 'Tunnelbana',
        transport_mode_id: 4,
        transport_mode_name: 'heavy_rail'
      }

      expected_line2 = {
        id: line2.id,
        name: 'L2',
        url_name: 'l2',
        color: 'green',
        system_id: system.id,
        system_name: 'Tunnelbana',
        transport_mode_id: 5,
        transport_mode_name: 'light_rail'
      }

      assert_equal [expected_line1, expected_line2], city_lines_systems_and_modes(city)
    end
  end
end
