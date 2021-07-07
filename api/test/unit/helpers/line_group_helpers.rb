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
      1938..9999 => [1938..1940, 1940..1950, 1950..9999],
      1930..1940 => [1930..1938, 1938..1940],
      1940..1950 => [1940..1950]
    }
    expected_groups3 = {
      1938..9999 => [0, 1, 2],
      1930..1940 => [3, 0],
      1940..1950 => [1]
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
  end
end
