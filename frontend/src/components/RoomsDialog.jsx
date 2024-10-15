import React, { useState, useEffect } from 'react';
import { Button, Box, Input, Heading, Text, Spinner, FormControl, FormLabel, Card, CardBody, Stack } from '@chakra-ui/react';
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
      // Primero, actualiza la presencia del usuario en la sala
      await api.post('/v1/room_presences', {
        user_id: user.id,
        room_id: room.id,
      });

      // Después, obtén la sala completa con todas las asociaciones
      const response = await api.get(`/v1/rooms/${room.id}`);
      onRoomSelected(response.data); // Notifica al componente padre con el room completo
    } catch (err) {
      setError('Error al unirse a la sala');
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
        <Text mb={2}>Elige una sala para unirte:</Text>
      )}

      {/* Lista de salas */}
      {rooms.length === 0 ? (
        <Text>No hay salas disponibles.</Text>
      ) : (
        <Stack spacing={2}>
          {rooms.map((room) => (
            <Card
              key={room.id}
              borderWidth="1px"
              borderRadius="md"
              overflow="hidden"
              p={2}
              cursor="pointer"
              _hover={{ bg: 'gray.100' }}
              onClick={() => handleRoomClick(room)}
            >
              <CardBody p={2}>
                <Heading as="h4" size="sm">
                  {room.name}
                </Heading>
              </CardBody>
            </Card>
          ))}
        </Stack>
      )}

      {/* Campo para crear una nueva sala */}
      <FormControl mt={4} as="form" onSubmit={handleCreateRoom}>
        <FormLabel>Crear nueva sala</FormLabel>
        <Input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Nombre de la nueva sala"
          mb={2}
          size="sm"
        />
        <Button type="submit" colorScheme="green" w="100%" size="sm">
          Crear sala
        </Button>
      </FormControl>
    </Box>
  );
};

export default RoomsDialog;
