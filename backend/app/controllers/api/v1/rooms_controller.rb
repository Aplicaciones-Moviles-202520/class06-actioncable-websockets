# app/controllers/api/v1/rooms_controller.rb
module API
  module V1
    class RoomsController < ApplicationController
      before_action :set_room, only: [:show]

      # GET /api/v1/rooms
      def index
        @rooms = Room.all
        render json: @rooms
      end

      # GET /api/v1/rooms/:id
      def show
        render json: @room, include: {
          messages: {},
          question_instance: {
            include: {
              question: {
                include: :choices
              }
            }
          },
          vote_rounds: {}  # Incluye las rondas de votación
        }
      end

      # POST /api/v1/rooms
      def create
        @room = Room.new(room_params)
        if @room.save
          render json: @room, status: :created
        else
          render json: @room.errors, status: :unprocessable_entity
        end
      end

      private

      def set_room
        @room = Room.includes(
          :messages,
          { question_instance: { question: :choices } }, # Carga los modelos relacionados
          :vote_rounds
        ).find(params[:id])
      end

      def room_params
        params.require(:room).permit(:name)
      end
    end
  end
end
