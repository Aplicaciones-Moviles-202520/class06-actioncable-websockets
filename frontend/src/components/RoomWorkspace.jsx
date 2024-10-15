// src/components/RoomWorkspace.jsx
import React from 'react';
import { Tabs, Text, TabList, TabPanels, Tab, TabPanel, Box } from '@chakra-ui/react';
import ChatRoom from './ChatRoom';
import VoteDialog from './VoteDialog';

const RoomWorkspace = ({ user, room }) => {
  const questionInstance = room.question_instance;  // Asumiendo que esto se incluye en la respuesta de la API
  
  // Asegúrate de que vote_rounds esté definido y tenga contenido
  const latestVoteRound = (room.vote_rounds && room.vote_rounds.length > 0)
    ? room.vote_rounds.sort((a, b) => b.number - a.number)[0]
    : null;

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
            <ChatRoom user={user} room={room} />
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
