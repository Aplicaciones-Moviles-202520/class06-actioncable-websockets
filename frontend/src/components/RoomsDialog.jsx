// src/components/RoomsDialog.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';  // Importa la instancia de Axios

const RoomsDialog = ({ user, onRoomSelected }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleRoomClick = (room) => {
    onRoomSelected(room); // Notifica al componente padre la selección de la sala
  };

  if (loading) {
    return <div>Cargando salas...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Bienvenido, {user.nickname}</h2>
      <h3>Elige una sala para unirte:</h3>
      {rooms.length === 0 ? (
        <p>No hay salas disponibles.</p>
      ) : (
        <ul>
          {rooms.map((room) => (
            <li key={room.id}>
              <button onClick={() => handleRoomClick(room)}>
                Unirse a {room.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomsDialog;
