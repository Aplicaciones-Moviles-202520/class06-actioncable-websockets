# app/controllers/api/v1/messages_controller.rb
module API
  module V1
    class MessagesController < ApplicationController
      before_action :set_room, only: [:index, :create]
      before_action :set_message, only: [:show] #:update, :destroy

      # GET /api/v1/rooms/:room_id/messages
      def index
        @messages = @room.messages
        render json: @messages
      end

      # app/controllers/api/v1/messages_controller.rb
      def create
        @message = @room.messages.build(message_params)
        @message.user = User.find(params[:user_id])

        if @message.save
          # Transmitir el nuevo mensaje a todos los suscritos a esta sala
          ActionCable.server.broadcast "room_#{@room.id}", { message: @message.as_json(include: :user) }
          render json: @message, status: :created
        else
          render json: @message.errors, status: :unprocessable_entity
        end
      end

      # GET /api/v1/messages/:id
      def show
        render json: @message
      end

      private

      def set_room
        @room = Room.find(params[:room_id])
      end

      def set_message
        @message = Message.find(params[:id])
      end

      def message_params
        params.require(:message).permit(:content, :user_id, :parent_message_id) # Para manejar respuestas
      end
    end
  end
end
