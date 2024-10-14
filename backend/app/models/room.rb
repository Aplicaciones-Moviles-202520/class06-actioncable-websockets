class Room < ApplicationRecord
  has_many :messages
  has_many :vote_rounds, dependent: :destroy  

  after_create :create_initial_vote_round

  private

  def create_initial_vote_round
    vote_rounds.create(number: 1)
  end  
end
