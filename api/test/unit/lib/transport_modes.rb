describe TransportModes do
  it "should be a hash with the transport modes data" do
    assert TransportModes::TRANSPORT_MODES.is_a?(Hash)
    assert_equal 9, TransportModes::TRANSPORT_MODES.keys.count
    TransportModes::TRANSPORT_MODES.each_pair do |k,v|
      assert v[:name]
      assert v[:width]
      assert v[:min_width]
    end
  end

  it "should return an array" do
    modes = TransportModes.all
    assert modes.is_a?(Array)

    modes.each do |mode|
      assert mode[:id]
      assert mode[:name]
      assert mode[:width]
      assert mode[:min_width]
    end
  end
end
