// src/components/RoomWorkspace.jsx
import { useState, useEffect } from 'react';
import { Tabs, Text, TabList, TabPanels, Tab, TabPanel, Box } from '@chakra-ui/react';
import ChatRoom from './ChatRoom';
import VoteDialog from './VoteDialog';

const RoomWorkspace = ({ user, room, onRoomUpdate }) => {
  const questionInstance = room.question_instance;  // Asumiendo que esto se incluye en la respuesta de la API
  
  // Estado para la última ronda de votación
  const [latestVoteRound, setLatestVoteRound] = useState(1);

  // useEffect para actualizar latestVoteRound cuando room.vote_rounds cambie
  useEffect(() => {
    if (room.vote_rounds && room.vote_rounds.length > 0) {
      const sortedRounds = room.vote_rounds.sort((a, b) => b.number - a.number);
      setLatestVoteRound(sortedRounds[0]);
    }
  }, [room.vote_rounds]);

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Pregunta: {room.question_instance.question.statement}</Text>

      <Tabs variant="enclosed">
        <TabList>
          <Tab>Chat</Tab>
          <Tab>Vote</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* Contenido de la pestaña "Chat" */}
            <ChatRoom user={user} room={room} onRoomUpdate={onRoomUpdate} />
          </TabPanel>
          <TabPanel>
            {/* Placeholder para la funcionalidad de votación */}
            <Box>
              {questionInstance && (
              <VoteDialog user={user} question={questionInstance.question} voteRound={latestVoteRound} />
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default RoomWorkspace;
