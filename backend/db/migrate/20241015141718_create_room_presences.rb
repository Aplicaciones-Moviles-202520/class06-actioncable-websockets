class CreateRoomPresences < ActiveRecord::Migration[7.2]
  def change
    create_table :room_presences do |t|
      t.references :user, null: false, foreign_key: true
      t.references :room, null: false, foreign_key: true

      t.timestamps
    end
    #add_index :room_presences, :user_id, unique: true # Un usuario solo puede estar en un Room a la vez      
  end
end
