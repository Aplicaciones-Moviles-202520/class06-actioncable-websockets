# app/channels/room_channel.rb
class RoomChannel < ApplicationCable::Channel
  def subscribed
    # Los usuarios se suscriben a un stream específico de la sala
    stream_from "room_#{params[:room_id]}"
  end

  def unsubscribed
    # Cualquier cleanup si es necesario al desconectarse
  end
end