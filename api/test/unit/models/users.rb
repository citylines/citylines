require File.expand_path '../../../test_config', __FILE__

describe User do
  before do
    @user = User.create(name: 'Pepe Grillo', email: 'pepe.grillo@disney.com')
  end

  describe 'initials and nickname' do
    it 'should return the default initials and nickname' do
      assert_equal 'Pepe', @user.nickname
      assert_equal 'PG', @user.initials
    end

    it 'should return custom initials and nickname' do
      @user.custom_name = 'Osvaldo Laport'
      @user.save

      assert_equal 'Osvaldo Laport', @user.nickname
      assert_equal 'OL', @user.initials
    end

    it 'should return custom initials and (short) nickname' do
      @user.custom_name = 'piwi'
      @user.save

      assert_equal 'piwi', @user.nickname
      assert_equal 'PI', @user.initials
    end
  end

  describe 'gravatar' do
    it 'should set an avatar URL' do
      refute @user.img_url
      @user.set_gravatar_img
      assert @user.img_url
    end
  end

  describe 'URL' do
    it 'should return the user relative URL' do
      assert_equal "/user/#{@user.id}", @user.relative_url
    end
  end
end
