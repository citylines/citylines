require File.expand_path '../../../test_config', __FILE__

describe LineGroupHelpers do
  include LineGroupHelpers

  it "should compute the right ranges and line groups" do
    ranges = [1930 .. 1940, 1940 .. 1950, 1945 .. 9999]
    expected_ranges = {
      1930..1940 => [1930..1940],
      1940..1950 => [1940..1945, 1945..1950],
      1945..9999 => [1945..1950, 1950..9999]
    }
    expected_groups = {
      1930..1940 => [0],
      1940..1950 => [1, 2],
      1945..9999 => [2, 3]
    }
    assert_equal expected_ranges, find_ranges(ranges)
    assert_equal expected_groups, compute_groups(ranges)

    ranges2 = [1930 .. 1940, 1940 .. 1950, 1938 .. 9999]
    expected_ranges2 = {
      1930..1940 => [1930..1938, 1938..1940],
      1940..1950 => [1940..1950],
      1938..9999 => [1938..1940, 1940..1950, 1950..9999]
    }
    expected_groups2 = {
      1930..1940 => [0, 1],
      1940..1950 => [2],
      1938..9999 => [1, 2, 3]
    }
    assert_equal expected_ranges2, find_ranges(ranges2)
    assert_equal expected_groups2, compute_groups(ranges2)

    ranges3 = [1938 .. 9999, 1930 .. 1940, 1940 .. 1950]
    expected_ranges3 = {
      1930..1940 => [1930..1938, 1938..1940],
      1938..9999 => [1938..1940, 1940..1950, 1950..9999],
      1940..1950 => [1940..1950]
    }
    expected_groups3 = {
      1930..1940 => [0, 1],
      1938..9999 => [1, 2, 3],
      1940..1950 => [2]
    }
    assert_equal expected_ranges3, find_ranges(ranges3)
    assert_equal expected_groups3, compute_groups(ranges3)

    ranges4 = [1939 .. 1945, 1939 .. 1945]
    expected_ranges4 = {
      1939..1945 => [1939..1945],
    }
    expected_groups4 = {
      1939..1945 => [0],
    }
    assert_equal expected_ranges4, find_ranges(ranges4)
    assert_equal expected_groups4, compute_groups(ranges4)

    ranges5 = [1939 .. 1945]
    expected_ranges5 = {
      1939..1945 => [1939..1945],
    }
    expected_groups5 = {
      1939..1945 => [0],
    }
    assert_equal expected_ranges5, find_ranges(ranges5)
    assert_equal expected_groups5, compute_groups(ranges5)

    ranges6 = [0..999999, 1995..1997]
    expected_ranges6 = {
      0..999999 => [0..1995, 1995..1997, 1997..999999],
      1995..1997 => [1995..1997],
    }
    expected_groups6 = {
      0..999999 => [0, 1, 2],
      1995..1997 => [1],
    }
    assert_equal expected_ranges6, find_ranges(ranges6)
    assert_equal expected_groups6, compute_groups(ranges6)

    ranges7 = [1990..2000, 1995..2005]
    expected_ranges7 = {
      1990..2000 => [1990..1995, 1995..2000],
      1995..2005 => [1995..2000, 2000..2005],
    }
    expected_groups7 = {
      1990..2000 => [0, 1],
      1995..2005 => [1, 2],
    }
    assert_equal expected_ranges7, find_ranges(ranges7)
    assert_equal expected_groups7, compute_groups(ranges7)

    ranges8 = [0..9999, 1990..2000, 1995..2005]
    expected_ranges8 = {
      0..9999 => [0..1990, 1990..1995, 1995..2000, 2000..2005, 2005..9999],
      1990..2000 => [1990..1995, 1995..2000],
      1995..2005 => [1995..2000, 2000..2005],

    }
    expected_groups8 = {
      0..9999 => [0, 1, 2, 3, 4],
      1990..2000 => [1, 2],
      1995..2005 => [2, 3],
    }
    assert_equal expected_ranges8, find_ranges(ranges8)
    assert_equal expected_groups8, compute_groups(ranges8)
  end

  it "should remove/avoid duplicated ranges" do
    ranges = [1930 .. 1940, 1930 .. 9999, 1930 .. 9999]
    expected_ranges = {
      1930..1940 => [1930..1940],
      1930..9999 => [1930..1940, 1940..9999]
    }
    expected_groups = {
      1930..1940 => [0],
      1930..9999 => [0, 1],
    }
    assert_equal expected_ranges, find_ranges(ranges)
    assert_equal expected_groups, compute_groups(ranges)

    ranges2 = [1930..1940, 1930..9999, 1935..1939]
    expected_ranges2 = {
      1930..1940 => [1930..1935, 1935..1939, 1939..1940],
      1930..9999 => [1930..1935, 1935..1939, 1939..1940, 1940..9999],
      1935..1939 => [1935..1939],
    }
    expected_groups2 = {
      1930..1940 => [0, 1, 2],
      1930..9999 => [0, 1, 2, 3],
      1935..1939 => [1],
    }
    assert_equal expected_ranges2, find_ranges(ranges2)
    assert_equal expected_groups2, compute_groups(ranges2)
  end

  describe "set_feature_line_groups" do
    before do
      @city = City.create(name: "test city", url_name: "test_city")
      @section = Section.create(city_id: @city.id, opening: 1920, closure: 2000)
      @line1 = Line.create(name: "A", city_id: @city.id)
      @section_line = SectionLine.create(line_id: @line1.id, section_id: @section.id)
    end

    it "should build 1 line group" do
      set_feature_line_groups(@section)
      expected_line_groups = [
        {section_line_id: @section_line.id, from: nil, to: nil, line_group: 0, group_members_count:1, order: 1}
      ]
      assert_equal expected_line_groups, get_section_line_groups(@section)
    end

    it "should build 3 line groups" do
      line2 = Line.create(name: "B", city_id: @city.id)
      section_line2 = SectionLine.create(line_id: line2.id, section_id: @section.id, fromyear: 1950)
      set_feature_line_groups(@section)

      expected_line_groups = [
        {section_line_id: @section_line.id, from: nil, to: 1950, line_group: 0, group_members_count:1, order: 1},
        {section_line_id: @section_line.id, from: 1950, to: nil, line_group: 1, group_members_count: 2, order: 1},
        {section_line_id: section_line2.id, from: 1950, to: nil, line_group: 1, group_members_count: 2, order: 2}
      ]
      assert_equal expected_line_groups, get_section_line_groups(@section)
    end

    it "should build 6 line groups" do
      line2 = Line.create(name: "B", city_id: @city.id)
      section_line2 = SectionLine.create(line_id: line2.id, section_id: @section.id, fromyear: 1940)

      line3 = Line.create(name: "C", city_id: @city.id)
      section_line3 = SectionLine.create(line_id: line3.id, section_id: @section.id, fromyear: 1960, toyear: 1990)
      set_feature_line_groups(@section)

      expected_line_groups = [
        {section_line_id: @section_line.id, from: nil, to: 1940, line_group: 0, group_members_count: 1, order: 1},
        {section_line_id: @section_line.id, from: 1940, to: 1960, line_group: 1, group_members_count: 2, order: 1},
        {section_line_id: @section_line.id, from: 1960, to: 1990, line_group: 2, group_members_count: 3, order: 1},
        {section_line_id: @section_line.id, from: 1990, to: nil, line_group: 3, group_members_count: 2, order: 1},
        {section_line_id: section_line2.id, from: 1940, to: 1960, line_group: 1, group_members_count: 2, order: 2},
        {section_line_id: section_line2.id, from: 1960, to: 1990, line_group: 2, group_members_count: 3, order: 2},
        {section_line_id: section_line2.id, from: 1990, to: nil, line_group: 3, group_members_count: 2, order: 2},
        {section_line_id: section_line3.id, from: 1960, to: 1990, line_group: 2, group_members_count: 3, order: 3},
      ]
      assert_equal expected_line_groups, get_section_line_groups(@section)
    end

    it "should build 7 line groups" do
      line2 = Line.create(name: "B", city_id: @city.id)
      section_line2 = SectionLine.create(line_id: line2.id, section_id: @section.id, fromyear: 1940, toyear: 1980)

      line3 = Line.create(name: "C", city_id: @city.id)
      section_line3 = SectionLine.create(line_id: line3.id, section_id: @section.id, fromyear: 1960, toyear: 1990)
      set_feature_line_groups(@section)

      expected_line_groups = [
        {section_line_id: @section_line.id, from: nil, to: 1940, line_group: 0, group_members_count: 1, order: 1},
        {section_line_id: @section_line.id, from: 1940, to: 1960, line_group: 1, group_members_count: 2, order: 1},
        {section_line_id: @section_line.id, from: 1960, to: 1980, line_group: 2, group_members_count: 3, order: 1},
        {section_line_id: @section_line.id, from: 1980, to: 1990, line_group: 3, group_members_count: 2, order: 1},
        {section_line_id: @section_line.id, from: 1990, to: nil, line_group: 4, group_members_count: 1, order: 1},
        {section_line_id: section_line2.id, from: 1940, to: 1960, line_group: 1, group_members_count: 2, order: 2},
        {section_line_id: section_line2.id, from: 1960, to: 1980, line_group: 2, group_members_count: 3, order: 2},
        {section_line_id: section_line3.id, from: 1960, to: 1980, line_group: 2, group_members_count: 3, order: 3},
        {section_line_id: section_line3.id, from: 1980, to: 1990, line_group: 3, group_members_count: 2, order: 2}
      ]
      assert_equal expected_line_groups, get_section_line_groups(@section)
    end
  end
end

def get_section_line_groups(section)
  @section.section_lines.map(&:section_line_groups).flatten.map(&:values).
    map do |line_group|
      line_group.slice(:section_line_id, :from, :to, :line_group, :group_members_count, :order)
  end.sort_by {|line_group| line_group[:section_line_id] }
end
