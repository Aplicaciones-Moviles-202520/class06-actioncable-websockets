// src/components/RoomWorkspace.jsx
import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from '@chakra-ui/react';
import ChatRoom from './ChatRoom';

const RoomWorkspace = ({ user, room }) => {
  return (
    <Box p={4}>
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
              <p>Funcionalidad de votación próximamente.</p>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default RoomWorkspace;
