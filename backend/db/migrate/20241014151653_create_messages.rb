class CreateMessages < ActiveRecord::Migration[7.2]
  def change
    create_table :messages do |t|
      t.text :content
      t.references :user, null: false, foreign_key: true
      t.references :room, null: false, foreign_key: true
      t.references :parent_message, foreign_key: { to_table: :messages }  # Aquí agregas la referencia autoreferencial
      
      t.timestamps
    end
  end
end
