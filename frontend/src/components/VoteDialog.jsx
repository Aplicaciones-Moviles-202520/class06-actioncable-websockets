// src/components/VoteDialog.jsx
import React, { useState } from 'react';
import { Box, Button, RadioGroup, Radio, Stack, Text, useToast } from '@chakra-ui/react';
import api from '../api';  // Importa la instancia de Axios

const VoteDialog = ({ user, question, voteRound }) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedChoice) {
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
      await api.post('/v1/votes', {
        choice_vote: {
          user_id: user.id,
          choice_id: selectedChoice,
          vote_round_id: voteRound.id,
        },
      });
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

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <RadioGroup onChange={setSelectedChoice} value={selectedChoice}>
          <Stack>
            {question.choices.map((choice) => (
              <Radio key={choice.id} value={choice.id.toString()}>
                {choice.text}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
        <Button mt={4} colorScheme="blue" type="submit">
          Enviar Voto
        </Button>
      </form>
    </Box>
  );
};

export default VoteDialog;
