class AddNumberToChoices < ActiveRecord::Migration[7.2]
  def change
    add_column :choices, :number, :integer, null: false
    add_index :choices, [:question_id, :number], unique: true
  end
end
