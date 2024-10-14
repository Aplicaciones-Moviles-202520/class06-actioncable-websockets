class CreateChoiceVotes < ActiveRecord::Migration[7.2]
  def change
    create_table :choice_votes do |t|
      t.references :user, null: false, foreign_key: true
      t.references :choice, null: false, foreign_key: true
      t.references :vote_round, null: false, foreign_key: true

      t.timestamps
    end
  end
end
