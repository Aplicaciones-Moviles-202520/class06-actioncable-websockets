class CreateQuestionInstances < ActiveRecord::Migration[7.2]
  def change
    create_table :question_instances do |t|
      t.references :room, null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true

      t.timestamps
    end
  end
end
