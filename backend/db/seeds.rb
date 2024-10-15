# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end
require 'yaml'

User.create(nickname: "Sistema")

# Cargar preguntas desde el archivo de fixtures
questions_fixture = YAML.load_file(Rails.root.join('test', 'fixtures', 'questions.yml'))

# Crear preguntas
questions = {}
questions_fixture.each do |key, attributes|
  question = Question.find_or_create_by!(attributes)
  questions[key] = question  # Guardar la referencia a la pregunta creada
end

puts "Questions loaded from fixtures."

# Cargar choices desde el archivo de fixtures
choices_fixture = YAML.load_file(Rails.root.join('test', 'fixtures', 'choices.yml'))

# Crear choices vinculados a las preguntas
choices_fixture.each do |key, attributes|
  question_key = attributes.delete('question') # Extrae la referencia a la pregunta
  question = questions[question_key] # Busca la pregunta en el hash
  Choice.find_or_create_by!(**attributes, question: question)
end

puts "Choices loaded from fixtures."
