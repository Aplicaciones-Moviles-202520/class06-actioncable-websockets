class Question < ApplicationRecord
  has_many :question_instances
  validates :statement, presence: true
  has_many :choices, dependent: :destroy  
end
