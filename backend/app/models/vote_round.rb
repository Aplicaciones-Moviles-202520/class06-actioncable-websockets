class VoteRound < ApplicationRecord
  belongs_to :room
  has_many :choice_votes, dependent: :destroy
  
  validates :number, presence: true, numericality: { only_integer: true }  
end
