class Choice < ApplicationRecord
  belongs_to :question
  validates :text, presence: true  
  has_many :choice_votes, dependent: :destroy

  validates :number, presence: true, uniqueness: { scope: :question_id }
end
