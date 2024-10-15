class User < ApplicationRecord
  has_many :room_presences, dependent: :destroy
  has_many :rooms, through: :room_presences
end
