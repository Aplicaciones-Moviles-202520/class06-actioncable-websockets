class RoomPresence < ApplicationRecord
  belongs_to :user
  belongs_to :room

  # Callback que garantiza que un usuario solo pueda estar en un room a la vez
  before_create :ensure_single_room

  private

  def ensure_single_room
    # Eliminar presencia de cualquier otro Room si el usuario ya está en una sala
    RoomPresence.where(user: user).destroy_all
  end
end
