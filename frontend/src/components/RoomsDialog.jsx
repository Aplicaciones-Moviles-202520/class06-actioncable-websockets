// src/components/RoomsDialog.jsx
import { useEffect, useState } from 'react';
import { Box, Button, Input, Text, List, ListItem } from '@chakra-ui/react';
import api from '../api';  // Importa la instancia de Axios
import ChatRoom from './ChatRoom'; // Importamos el componente ChatRoom

const RoomsDialog = ({ user }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [error, setError] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null); // Estado para la sala seleccionada

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('/v1/rooms');
        setRooms(response.data);
      } catch (error) {
        setError('Error al obtener las salas. Inténtalo nuevamente.');
      }
    };
    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    try {
      const response = await api.post('/v1/rooms', { name: newRoomName });
      setRooms([...rooms, response.data]); // Agrega la nueva sala a la lista
      setNewRoomName('');
    } catch (error) {
      setError('Error al crear la sala. Inténtalo nuevamente.');
    }
  };

  if (selectedRoom) {
    // Si el usuario selecciona una sala, mostramos el componente ChatRoom
    return <ChatRoom user={user} room={selectedRoom} />;
  }

  return (
    <Box p={4}>
      <Text mb={4}>Bienvenido, {user.nickname}. Elige una sala para unirte o crea una nueva:</Text>
      
      <Input
        placeholder="Nombre de la nueva sala"
        value={newRoomName}
        onChange={(e) => setNewRoomName(e.target.value)}
        mb={4}
      />
      <Button onClick={handleCreateRoom} colorScheme="teal" mb={4}>
        Crear Sala
      </Button>

      {error && <Text color="red.500" mt={2}>{error}</Text>}

      <List spacing={3}>
        {rooms.map((room) => (
          <ListItem key={room.id}>
            <Button onClick={() => setSelectedRoom(room)} colorScheme="blue">
              Unirse a {room.name}
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default RoomsDialog;
