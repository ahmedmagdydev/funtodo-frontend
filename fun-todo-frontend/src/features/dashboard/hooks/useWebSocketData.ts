import { useState, useEffect, useRef } from "react";
import WebSocketService from "../../../api/websocket";
import { ClientData, SortOption } from "../types/dashboard";

const SORT_OPTIONS_KEY = "dashboard_sort_options";

export const useWebSocketData = () => {
  const [clientSensors, setClientSensors] = useState<ClientData[]>([]);
  const [clientSortOptions, setClientSortOptions] = useState<
    Record<string, SortOption>
  >(() => {
    // Initialize from localStorage
    const savedOptions = localStorage.getItem(SORT_OPTIONS_KEY);
    return savedOptions ? JSON.parse(savedOptions) : {};
  });
  const webSocketRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    webSocketRef.current = WebSocketService.getInstance();

    const handleSensorData = (data: ClientData[]) => {
      setClientSensors((prevData) => {
        // Update existing data while preserving structure
        const updatedData = data.map((newClient) => {
          const existingClient = prevData.find(
            (c) => c.clientId === newClient.clientId
          );
          if (existingClient) {
            // Merge new sensor data with existing data
            return {
              ...newClient,
              sensors: newClient.sensors.map((sensor) => {
                return {
                  ...sensor,
                  value: sensor.values, // Use new value
                };
              }),
            };
          }
          return newClient;
        });
        return updatedData;
      });

      // Initialize sort options for new clients without affecting existing ones
      setClientSortOptions((prev) => {
        const newSortOptions = { ...prev };
        let hasChanges = false;

        data.forEach((client) => {
          if (!newSortOptions[client.clientId]) {
            newSortOptions[client.clientId] = "name";
            hasChanges = true;
          }
        });

        if (hasChanges) {
          localStorage.setItem(
            SORT_OPTIONS_KEY,
            JSON.stringify(newSortOptions)
          );
        }
        return newSortOptions;
      });
    };

    const unsubscribe = webSocketRef.current.subscribe(handleSensorData);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Only run on mount/unmount

  const handleSortChange = (clientId: string, sortOption: SortOption) => {
    setClientSortOptions((prev) => {
      const newOptions = {
        ...prev,
        [clientId]: sortOption,
      };
      localStorage.setItem(SORT_OPTIONS_KEY, JSON.stringify(newOptions));
      return newOptions;
    });
  };

  return {
    clientSensors,
    clientSortOptions,
    handleSortChange,
  };
};
