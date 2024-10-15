import React, { useState, useEffect } from 'react';
import { Box, Button, RadioGroup, Radio, Stack, Text, useToast, Spinner } from '@chakra-ui/react';
import api from '../api';  // Importa la instancia de Axios

const VoteDialog = ({ user, question, voteRound }) => {
  const [selectedChoiceId, setSelectedChoiceId] = useState(null); // Mantiene el choice_id seleccionado
  const [choiceVote, setChoiceVote] = useState(null); // Almacena el voto completo si ya fue enviado
  const [loading, setLoading] = useState(true); // Estado de carga para manejar el rendering condicional
  const toast = useToast();

  useEffect(() => {
    // Verificar si el usuario ya ha votado en esta ronda de votación
    const fetchVote = async () => {
      setLoading(true); // Iniciar carga
      try {
        const response = await api.get(`/v1/votes`, {
          params: { user_id: user.id, vote_round_id: voteRound.id }
        });
        if (response.data) {
          setChoiceVote(response.data); // Si ya existe un voto, lo guardamos en el estado
          setSelectedChoiceId(response.data.choice_id); // Actualizamos el selectedChoiceId con el voto
        }
      } catch (err) {
        console.error("Error fetching vote:", err);
      } finally {
        setLoading(false); // Terminar carga
      }
    };

    fetchVote();
  }, [user.id, voteRound.id]); // Ejecuta cuando el usuario o la ronda cambian

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedChoiceId) {
      toast({
        title: "Error",
        description: "Por favor selecciona una opción.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await api.post('/v1/votes', {
        choice_vote: {
          user_id: user.id,
          choice_id: selectedChoiceId, // Usamos el choice_id seleccionado
          vote_round_id: voteRound.id,
        },
      });

      setChoiceVote(response.data); // Almacena el objeto de voto retornado por el backend
      toast({
        title: "Voto registrado",
        description: "Tu voto ha sido enviado correctamente.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar tu voto. Intenta nuevamente.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    // Muestra un spinner mientras se carga el voto
    return <Spinner size="xl" />;
  }

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <RadioGroup
          onChange={(value) => setSelectedChoiceId(value)} // Solo cambiamos el selectedChoiceId, no el voto aún
          value={selectedChoiceId || ""} // Aseguramos que el choice_id seleccionado se mantenga al recargar
        >
          <Stack>
            {question.choices.map((choice) => (
              <Radio key={choice.id} value={choice.id.toString()} isDisabled={!!choiceVote}>
                <Text color={selectedChoiceId === choice.id.toString() ? "green.500" : "black"}>
                  {choice.text}
                </Text>
              </Radio>
            ))}
          </Stack>
        </RadioGroup>

        {/* Mostrar el botón de enviar sólo si no hay un voto registrado */}
        {!choiceVote && (
          <Button mt={4} colorScheme="blue" type="submit">
            Enviar Voto
          </Button>
        )}

        {/* Mostrar mensaje si ya se ha votado */}
        {choiceVote && (
          <Text mt={4} fontSize="lg" color="green.500">
            Tu voto ha sido enviado.
          </Text>
        )}
      </form>
    </Box>
  );
};

export default VoteDialog;
