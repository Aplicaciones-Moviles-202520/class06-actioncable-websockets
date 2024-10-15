# app/controllers/api/v1/votes_controller.rb
module API
  module V1
    class VotesController < ApplicationController
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
        # Contar los usuarios presentes en la sala a través de room_presences
        total_users = room.room_presences.count
        total_votes = vote_round.choice_votes.count

        if total_votes == total_users
          # Crear el mensaje "Todos han votado!" por el usuario Sistema
          system_user = User.find_by(nickname: 'Sistema')
          message = room.messages.create!(
            content: "Todos han votado!",
            user: system_user
          )

          # Enviar el mensaje por ActionCable a todos los usuarios suscritos
          ActionCable.server.broadcast "room_#{room.id}", { message: message.as_json(include: :user) }
        end
      end
    end
  end
end
