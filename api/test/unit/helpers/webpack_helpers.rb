require File.expand_path '../../../test_config', __FILE__

describe WebpackHelpers do
  include WebpackHelpers

  describe 'webpack_asset_path' do
    it 'should return the actual path from the manifest' do
      stub_const(:WEBPACK_MANIFEST, {'main.js':'theactual/path.js'}) do
        assert_equal 'theactual/path.js', webpack_asset_path('main.js')
      end
    end

    it 'should return nil if the manifest is missing' do
      refute webpack_asset_path('main.js')
    end
  end
end
