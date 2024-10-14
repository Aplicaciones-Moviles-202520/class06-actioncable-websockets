// src/components/WelcomeDialog.jsx
import { useState } from 'react';
import { Box, Button, Input, Text } from '@chakra-ui/react';
import api from '../api';  // Importa la instancia de Axios

const WelcomeDialog = ({ onUserCreated }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await api.post('/v1/users', { nickname });
      localStorage.setItem('user', JSON.stringify(response.data)); // Almacena el usuario en localStorage
      onUserCreated(response.data); // Pasa el usuario creado al componente padre
    } catch (error) {
      setError('Error creando usuario. Inténtalo nuevamente.');
    }
  };

  return (
    <Box p={4} maxW="sm" borderWidth="1px" borderRadius="lg">
      <Text mb={4}>Ingresa tu nickname:</Text>
      <Input
        placeholder="Tu nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <Button mt={4} onClick={handleSubmit} colorScheme="teal">
        Crear Usuario
      </Button>
      {error && <Text color="red.500" mt={2}>{error}</Text>}
    </Box>
  );
};

export default WelcomeDialog;
