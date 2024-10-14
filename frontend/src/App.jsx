// src/App.jsx
import { useState, useEffect } from 'react';
import { Button, Flex, Spacer, Box, Heading } from '@chakra-ui/react';
import WelcomeDialog from './components/WelcomeDialog';
import RoomsDialog from './components/RoomsDialog';
import RoomWorkspace from './components/RoomWorkspace';

function App() {
  const [user, setUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    // Verifica si el usuario ya está en localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUserCreated = (createdUser) => {
    setUser(createdUser);
    localStorage.setItem('user', JSON.stringify(createdUser)); // Guarda en localStorage
  };

  const handleRoomSelected = (room) => {
    setSelectedRoom(room);
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedRoom(null);
    localStorage.removeItem('user'); // Elimina el usuario de localStorage
  };

  return (
    <div>
      {/* Topbar */}
      <Flex as="nav" bg="blue.500" p={4} color="white">
        <Heading as="h3" size="lg">CollabWorkspace</Heading>
        <Spacer />
        {user && (
          <Button colorScheme="red" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        )}
      </Flex>

      {/* Contenido */}
      <Box p={4}>
        {!user ? (
          <WelcomeDialog onUserCreated={handleUserCreated} />
        ) : selectedRoom ? (
          <RoomWorkspace user={user} room={selectedRoom} />
        ) : (
          <RoomsDialog user={user} onRoomSelected={handleRoomSelected} />
        )}
      </Box>
    </div>
  );
}

export default App;