# app/models/room.rb
class Room < ApplicationRecord
  has_many :messages
  has_many :vote_rounds, dependent: :destroy
  has_one :question_instance, dependent: :destroy  

  after_create :create_initial_vote_round
  after_create :create_random_question_instance

  private

  def create_initial_vote_round
    vote_rounds.create(number: 1)
  end

  def create_random_question_instance
    # Seleccionar una pregunta al azar
    random_question = Question.order('RANDOM()').first
    return unless random_question

    # Crear una instancia de QuestionInstance vinculada al room
    build_question_instance(question: random_question).save!
  end
end
