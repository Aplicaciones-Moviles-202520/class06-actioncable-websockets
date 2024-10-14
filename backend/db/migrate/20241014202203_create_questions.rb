class CreateQuestions < ActiveRecord::Migration[7.2]
  def change
    create_table :questions do |t|
      t.text :statement, null: false

      t.timestamps
    end
  end
end
