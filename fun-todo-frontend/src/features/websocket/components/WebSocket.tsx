import React, { useEffect, useState } from 'react';
import { ClientData } from '../../../features/dashboard/types/dashboard';
import WebSocketService from '../../../api/websocket';

const WebSocketComponent: React.FC = () => {
  const [clientSensors, setClientSensors] = useState<ClientData[]>([]);

  useEffect(() => {
    const webSocketService = WebSocketService.getInstance();
    
    // Subscribe to WebSocket updates
    const unsubscribe = webSocketService.subscribe((data) => {
      setClientSensors(data);
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <h2>WebSocket Data:</h2>
      <pre>{JSON.stringify(clientSensors, null, 2)}</pre>
    </div>
  );
};

export default WebSocketComponent;
