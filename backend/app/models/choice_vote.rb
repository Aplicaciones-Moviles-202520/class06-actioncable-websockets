class ChoiceVote < ApplicationRecord
  belongs_to :user
  belongs_to :choice
  belongs_to :vote_round

  # Un usuario puede votar una vez por ronda de votación
  validates :user_id, uniqueness: { scope: :vote_round_id }
end
