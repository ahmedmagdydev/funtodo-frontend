import React, { useEffect, useState } from 'react';

const WebSocketTest: React.FC = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Create WebSocket connection
    const ws = new WebSocket('ws://localhost:3001');

    // Connection opened
    ws.addEventListener('open', () => {
      setConnectionStatus('Connected');
      console.log('Connected to WebSocket');
    });

    // Listen for messages
    ws.addEventListener('message', (event) => {
      console.log('Message from server:', event.data);
      setMessages(prev => [...prev, event.data].slice(-5)); // Keep last 5 messages
    });

    // Handle errors
    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('Error');
    });

    // Handle connection close
    ws.addEventListener('close', () => {
      setConnectionStatus('Disconnected');
      console.log('Disconnected from WebSocket');
    });

    setSocket(ws);

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  // Function to send a test message
  const sendTestMessage = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send('Test message from client');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>WebSocket Test</h2>
      <div>
        <strong>Status:</strong> 
        <span style={{ 
          color: connectionStatus === 'Connected' ? 'green' : 
                 connectionStatus === 'Error' ? 'red' : 'orange'
        }}>
          {connectionStatus}
        </span>
      </div>
      
      <button 
        onClick={sendTestMessage}
        disabled={!socket || socket.readyState !== WebSocket.OPEN}
        style={{ margin: '20px 0' }}
      >
        Send Test Message
      </button>

      <div>
        <h3>Last 5 Messages:</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {messages.map((msg, index) => (
            <li key={index} style={{ margin: '10px 0', padding: '10px', background: '#f5f5f5' }}>
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketTest;
