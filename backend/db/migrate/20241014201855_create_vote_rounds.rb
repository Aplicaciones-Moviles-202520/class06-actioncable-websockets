class CreateVoteRounds < ActiveRecord::Migration[7.2]
  def change
    create_table :vote_rounds do |t|
      t.integer :number
      t.references :room, null: false, foreign_key: true

      t.timestamps
    end
  end
end
