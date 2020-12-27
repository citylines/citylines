module DiscussionHelpers
  def get_messages_for_city(city_id)
    DiscussionMessage.where(city_id: city_id).all.map do |msg|
      {
        id: msg.id,
        content: msg.content,
        user_id: msg.user_id,
        timestamp: msg.created_at
      }
    end
  end
end
