def benchmark(type="sections")
  include CityHelpers
  require "benchmark"
  tokyo = City[114]
  nums = 5.times.map do
    Benchmark.realtime do
      lines_features_collection(tokyo, type)
    end
  end
  nums.reduce(:+).fdiv(nums.size)
end

def benchmark_formatted(type="sections")
  include CityHelpers
  require "benchmark"
  tokyo = City[114]
  nums = 5.times.map do
    Benchmark.realtime do
      formatted_lines_features_collection(tokyo, type)
    end
  end
  nums.reduce(:+).fdiv(nums.size)
end
