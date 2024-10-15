// src/components/RoomsDialog.jsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Input, List, ListItem, Heading, Text, Spinner, FormControl, FormLabel } from '@chakra-ui/react';
import api from '../api';  // Importa la instancia de Axios

const RoomsDialog = ({ user, onRoomSelected }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRoomName, setNewRoomName] = useState(''); // Estado para el nombre de la nueva sala

  useEffect(() => {
    // Función para cargar las salas desde la API
    const fetchRooms = async () => {
      try {
        const response = await api.get('/v1/rooms'); // Cambia la URL según tu API
        setRooms(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar las salas');
        setLoading(false);
      }
    };

    fetchRooms(); // Llamada a la función para cargar las salas cuando se monta el componente
  }, []);

  const handleRoomClick = async (room) => {
    try {
      // Realiza la solicitud al backend para obtener el room completo con todas las asociaciones
      const response = await api.get(`/v1/rooms/${room.id}`);
      onRoomSelected(response.data); // Notifica al componente padre con el room completo
    } catch (err) {
      setError('Error al cargar la sala seleccionada');
    }
  };

  const handleCreateRoom = async (event) => {
    event.preventDefault();
    try {
      const response = await api.post('/v1/rooms', { name: newRoomName });
      setRooms([...rooms, response.data]); // Agrega la nueva sala a la lista de salas
      setNewRoomName(''); // Resetea el campo de texto
    } catch (err) {
      setError('Error al crear la sala');
    }
  };

  if (loading) {
    return <Spinner size="xl" />;
  }

  if (error) {
    return <Text color="red.500">{error}</Text>;
  }

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>
        Bienvenido, {user.nickname}
      </Heading>

      {/* Mostrar solo si hay salas disponibles */}
      {rooms.length > 0 && (
        <Text mb={4}>Elige una sala para unirte:</Text>
      )}

      {/* Lista de salas */}
      {rooms.length === 0 ? (
        <Text>No hay salas disponibles.</Text>
      ) : (
        <List spacing={3}>
          {rooms.map((room) => (
            <ListItem key={room.id}>
              <Button onClick={() => handleRoomClick(room)} colorScheme="blue" w="100%">
                Unirse a {room.name}
              </Button>
            </ListItem>
          ))}
        </List>
      )}

      {/* Campo para crear una nueva sala */}
      <FormControl mt={6} as="form" onSubmit={handleCreateRoom}>
        <FormLabel>Crear nueva sala</FormLabel>
        <Input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Nombre de la nueva sala"
          mb={2}
        />
        <Button type="submit" colorScheme="green" w="100%">
          Crear sala
        </Button>
      </FormControl>
    </Box>
  );
};

export default RoomsDialog;
