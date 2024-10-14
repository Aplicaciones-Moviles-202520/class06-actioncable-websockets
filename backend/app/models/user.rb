class User < ApplicationRecord
  has_many :messages
  has_many :choice_votes, dependent: :destroy
end
