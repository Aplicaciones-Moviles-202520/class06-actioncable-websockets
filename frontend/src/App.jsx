// src/App.jsx
import { useState, useEffect } from 'react';
import WelcomeDialog from './components/WelcomeDialog';
import RoomsDialog from './components/RoomsDialog';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verifica si el usuario ya está en localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleUserCreated = (createdUser) => {
    setUser(createdUser);
  };

  return (
    <div>
      {!user ? (
        <WelcomeDialog onUserCreated={handleUserCreated} />
      ) : (
        <RoomsDialog user={user} />
      )}
    </div>
  );
}

export default App;
