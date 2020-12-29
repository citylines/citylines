require File.expand_path '../../../test_config', __FILE__

describe DiscussionHelpers do
  include DiscussionHelpers

  describe "return messages and messages count" do
    before do
      @city1 = City.create(name: "Stockholm", url_name: "stockholm")
      @city2 = City.create(name: "Malmo", url_name: "malmo")
      @user = User.create(name: "Aureliano", email: "aureliano@suburra.it")
      @msg1 = DiscussionMessage.create(user_id: @user.id, city_id: @city1.id, content: "A msg")
      @msg2 = DiscussionMessage.create(user_id: @user.id, city_id: @city1.id, content: "Another msg")
      @msg3 = DiscussionMessage.create(user_id: @user.id, city_id: @city2.id, content: "Yet another msg")
    end

    it "should return all messages for the selected city" do
      expected_msgs = [
        {
          id: @msg1.id,
          content: @msg1.content,
          author_nickname: @user.nickname,
          author_url: @user.relative_url,
          timestamp: @msg1.created_at.iso8601,
        },
        {
          id: @msg2.id,
          content: @msg2.content,
          author_nickname: @user.nickname,
          author_url: @user.relative_url,
          timestamp: @msg2.created_at.iso8601,
        }
      ]

      assert_equal expected_msgs, get_messages_for_city(@city1.id)
    end

    it "should return the right number of messages for the selected city" do
      assert_equal 2, get_message_count_for_city(@city1.id)[:count]
    end
  end
end
