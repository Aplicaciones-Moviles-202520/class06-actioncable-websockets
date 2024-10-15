# app/controllers/api/v1/room_presences_controller.rb
module API
  module V1
    class RoomPresencesController < ApplicationController
      def create
        # Verificar si el usuario ya está en otra sala y actualizar su presencia
        room_presence = RoomPresence.new(user_id: params[:user_id], room_id: params[:room_id])

        if room_presence.save
          render json: room_presence, status: :created
        else
          render json: { errors: room_presence.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        room_presence = RoomPresence.find_by(user_id: params[:user_id])

        if room_presence
          room_presence.destroy
          render json: { message: 'Usuario ha salido de la sala' }, status: :ok
        else
          render json: { error: 'Usuario no está en ninguna sala' }, status: :not_found
        end
      end
    end
  end
end
