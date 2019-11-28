require File.expand_path '../../../test_config', __FILE__

describe User do
  describe 'initials and nickname' do
    before do
      @user = User.create(name: 'Pepe Grillo', email: 'pepe.grillo@disney.com')
    end

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
end
