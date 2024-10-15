# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2024_10_15_141718) do
  create_table "choice_votes", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "choice_id", null: false
    t.integer "vote_round_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["choice_id"], name: "index_choice_votes_on_choice_id"
    t.index ["user_id"], name: "index_choice_votes_on_user_id"
    t.index ["vote_round_id"], name: "index_choice_votes_on_vote_round_id"
  end

  create_table "choices", force: :cascade do |t|
    t.string "text", null: false
    t.integer "question_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "number", null: false
    t.index ["question_id", "number"], name: "index_choices_on_question_id_and_number", unique: true
    t.index ["question_id"], name: "index_choices_on_question_id"
  end

  create_table "messages", force: :cascade do |t|
    t.text "content"
    t.integer "user_id", null: false
    t.integer "room_id", null: false
    t.integer "parent_message_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["parent_message_id"], name: "index_messages_on_parent_message_id"
    t.index ["room_id"], name: "index_messages_on_room_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "question_instances", force: :cascade do |t|
    t.integer "room_id", null: false
    t.integer "question_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["question_id"], name: "index_question_instances_on_question_id"
    t.index ["room_id"], name: "index_question_instances_on_room_id"
  end

  create_table "questions", force: :cascade do |t|
    t.text "statement", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "room_presences", force: :cascade do |t|
    t.integer "user_id", null: false
    t.integer "room_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["room_id"], name: "index_room_presences_on_room_id"
    t.index ["user_id"], name: "index_room_presences_on_user_id"
  end

  create_table "rooms", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "nickname"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "vote_rounds", force: :cascade do |t|
    t.integer "number"
    t.integer "room_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["room_id"], name: "index_vote_rounds_on_room_id"
  end

  add_foreign_key "choice_votes", "choices"
  add_foreign_key "choice_votes", "users"
  add_foreign_key "choice_votes", "vote_rounds"
  add_foreign_key "choices", "questions"
  add_foreign_key "messages", "messages", column: "parent_message_id"
  add_foreign_key "messages", "rooms"
  add_foreign_key "messages", "users"
  add_foreign_key "question_instances", "questions"
  add_foreign_key "question_instances", "rooms"
  add_foreign_key "room_presences", "rooms"
  add_foreign_key "room_presences", "users"
  add_foreign_key "vote_rounds", "rooms"
end
