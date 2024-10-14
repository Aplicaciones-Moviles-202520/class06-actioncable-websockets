class Message < ApplicationRecord
  belongs_to :user
  belongs_to :room
  belongs_to :parent_message, class_name: 'Message', optional: true
  has_many :replies, class_name: 'Message', foreign_key: 'parent_message_id'
  
  def as_json(options = {})
    super(options.merge(include: :user))
  end
end
