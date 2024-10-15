# app/controllers/api/v1/votes_controller.rb
module API
  module V1
    class VotesController < ApplicationController
      # Verifica si el usuario ya ha votado en la ronda actual
      def index
        vote = ChoiceVote.find_by(user_id: params[:user_id], vote_round_id: params[:vote_round_id])
        if vote
          render json: vote, status: :ok
        else
          render json: {}, status: :no_content
        end
      end
            
      def create
        vote = ChoiceVote.new(vote_params)

        if vote.save
          # Recargar el voto con todas las asociaciones necesarias (eager loading)
          vote = ChoiceVote.includes(vote_round: :room).find(vote.id)
          
          check_all_voted(vote.vote_round.room, vote.vote_round)
          render json: vote, status: :created
        else
          render json: { errors: vote.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private

      def vote_params
        params.require(:choice_vote).permit(:user_id, :choice_id, :vote_round_id)
      end

      # Método para verificar si todos los usuarios presentes en la sala han votado
      def check_all_voted(room, vote_round)
        total_users = room.room_presences.count
        total_votes = vote_round.choice_votes.count
      
        if total_votes == total_users
          choices_voted = vote_round.choice_votes.pluck(:choice_id)
          unanimous_choice = choices_voted.uniq.size == 1
      
          if unanimous_choice
            winning_choice = choices_voted.first
            choice = Choice.find(winning_choice)
      
            system_user = User.find_by(nickname: 'Sistema')
            message = room.messages.create!(
              content: "Se han puesto de acuerdo en la opción #{choice.number}, ¡buen trabajo!",
              user: system_user
            )
      
            ActionCable.server.broadcast "room_#{room.id}", { message: message.as_json(include: :user) }
          else
            system_user = User.find_by(nickname: 'Sistema')
            message = room.messages.create!(
              content: "¡Deben ponerse de acuerdo!",
              user: system_user
            )
      
            ActionCable.server.broadcast "room_#{room.id}", { message: message.as_json(include: :user) }
      
            # Crear una nueva ronda de votación
            new_vote_round = room.vote_rounds.create!(number: vote_round.number + 1)
      
            # Enviar notificación por ActionCable para que los clientes actualicen el estado del Room
            ActionCable.server.broadcast "room_#{room.id}", {
              notification: "Nueva ronda de votación iniciada",
              vote_round: new_vote_round.as_json
            }
          end
        end
      end
    end
  end
end
