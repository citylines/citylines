require File.expand_path '../../../test_config', __FILE__

describe WebpackHelpers do
  include WebpackHelpers

  describe 'webpack_asset_path' do
    it 'should return the actual path from the manifest' do
      stubs(:webpack_manifest).returns({'main.js' => 'theactual/path.js'})
      assert_equal '/assets/theactual/path.js', webpack_asset_path('main.js')
    end

    it 'should include the cdn' do
      stubs(:cdn_url).returns('https://my.cdn.cloudfront.net')
      stubs(:webpack_manifest).returns({'main.js' => 'theactual/path.js'})
      assert_equal 'https://my.cdn.cloudfront.net/assets/theactual/path.js', webpack_asset_path('main.js')
    end

    it 'should return nil if the manifest is missing' do
      stubs(:webpack_manifest).returns({})
      refute webpack_asset_path('main.js')
    end
  end
end
