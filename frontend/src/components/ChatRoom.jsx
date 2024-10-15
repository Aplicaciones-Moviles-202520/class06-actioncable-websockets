// src/components/ChatRoom.jsx
import { useEffect, useState } from 'react';
import { Box, Button, Input, Text, VStack } from '@chakra-ui/react';
import api from '../api';  // Importa la instancia de Axios
import * as ActionCable from '@rails/actioncable';

const ChatRoom = ({ user, room }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  // Construir la URL del WebSocket
  const websocketUrl = `${import.meta.env.VITE_BACKEND_SCHEMA}://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/${import.meta.env.VITE_WEBSOCKET_PATH}`;

  useEffect(() => {
    // Llamada inicial para obtener todos los mensajes de la sala
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/v1/rooms/${room.id}/messages`);
        setMessages(response.data);
      } catch (error) {
        setError('Error al cargar los mensajes. Inténtalo nuevamente.');
      }
    };
    fetchMessages();
    
    // Configurar la conexión WebSocket para escuchar nuevos mensajes
    const cableConnection = ActionCable.createConsumer("ws://localhost:3001/cable");
    const subscription = cableConnection.subscriptions.create(
      { channel: 'RoomChannel', room_id: room.id },
      {
        received(data) {
          // Actualizar los mensajes cuando se recibe uno nuevo
          setMessages((prevMessages) => [...prevMessages, data.message]);
        },
      }
    );

    // Limpiar la suscripción al desmontar el componente
    return () => {
      subscription.unsubscribe();
    };
  }, [room.id]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') {
      return; // No enviar mensajes vacíos
    }

    try {
      await api.post(`/v1/rooms/${room.id}/messages`, {
        content: newMessage,
        user_id: user.id,
      });
      setNewMessage(''); // Limpiar el campo de entrada
    } catch (error) {
      setError('Error al enviar el mensaje. Inténtalo nuevamente.');
    }
  };

  return (
    <Box p={4} maxW="lg" borderWidth="1px" borderRadius="lg">

      <Text mb={4}>
        <b>Sala:</b> {room.name}<br />
        <b>Indicaciones:</b> Discutan la pregunta planteada arriba.
      </Text>

      <VStack spacing={4} align="stretch" mb={4}>
        {messages.map((message) => (
          <Box key={message.id} p={3} bg="gray.100" borderRadius="md">
            <Text fontWeight="bold">{message.user.nickname}:</Text>
            <Text>{message.content}</Text>
          </Box>
        ))}
      </VStack>

      <Box display="flex" alignItems="center">
        <Input
          placeholder="Escribe tu mensaje"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          mr={2}
        />
        <Button onClick={handleSendMessage} colorScheme="teal">
          Enviar
        </Button>
      </Box>

      {error && <Text color="red.500" mt={2}>{error}</Text>}
    </Box>
  );
};

export default ChatRoom;
