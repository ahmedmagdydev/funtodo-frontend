import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
} from "@mui/material";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import WebSocketService from '../services/webSocket';
import { ClientData } from "../types/dashboard";

const SENSOR_COLORS = {
  temperature: "#ff9800",
  humidity: "#2196f3",
  pressure: "#4caf50",
};

export const Dashboard: React.FC = () => {
  const [clientSensors, setClientSensors] = useState<ClientData[]>([]);
  const [containerWidths, setContainerWidths] = useState<{ [key: string]: number }>({});
  const containerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const resizeObserver = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const webSocketService = WebSocketService.getInstance();
    
    const unsubscribe = webSocketService.subscribe((data) => {
      setClientSensors(data);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Initialize ResizeObserver
    resizeObserver.current = new ResizeObserver((entries) => {
      const newWidths: { [key: string]: number } = {};
      entries.forEach((entry) => {
        const clientId = entry.target.getAttribute('data-client-id');
        if (clientId) {
          newWidths[clientId] = entry.contentRect.width;
        }
      });
      setContainerWidths((prev) => ({ ...prev, ...newWidths }));
    });

    // Cleanup observer
    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []);

  // Update observers when clients change
  useEffect(() => {
    if (resizeObserver.current) {
      // Disconnect all current observations
      resizeObserver.current.disconnect();
      
      // Observe all container refs
      Object.entries(containerRefs.current).forEach(([clientId, element]) => {
        if (element) {
          resizeObserver.current?.observe(element);
        }
      });
    }
  }, [clientSensors]);

  const renderSensorBox = (sensorId: string, value: number) => {
    return (
      <Paper
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: (SENSOR_COLORS as any)[sensorId] || "#757575",
          color: "white",
          borderRadius: 2,
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {sensorId}
        </Typography>
        <Typography variant="h6">
          {value.toFixed(1)}
        </Typography>
      </Paper>
    );
  };

  const renderClientBox = (client: ClientData) => {
    const layout = client.sensors.map((sensor, index) => ({
      i: `${client.clientId}-${sensor.sensorId}`,
      x: index,
      y: 0,
      w: 1,
      h: 1,
      // static: true,
    }));

    const containerWidth = containerWidths[client.clientId] || 0;

    return (
      <Grid item xs={12} md={6} lg={4} key={client.clientId}>
        <Paper 
          elevation={2} 
          sx={{ 
            p: 3,
            height: '100%',
            bgcolor: 'white',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            {client.clientId}
          </Typography>
          <Box 
            ref={el => containerRefs.current[client.clientId] = el}
            data-client-id={client.clientId}
            sx={{ 
              bgcolor: 'grey.100', 
              p: 2, 
              borderRadius: 1,
              minHeight: '120px'
            }}
          >
            {containerWidth > 0 && (
              <GridLayout
                className="layout"
                layout={layout}
                cols={4}
                rowHeight={80}
                width={containerWidth - 32} // Subtract padding (16px * 2)
                isDraggable={true}
                isResizable={true}
                margin={[10, 10]}
                containerPadding={[0, 0]}
              >
                {client.sensors.map((sensor) => (
                  <div key={`${client.clientId}-${sensor.sensorId}`}>
                    {renderSensorBox(sensor.sensorId, sensor.value)}
                  </div>
                ))}
              </GridLayout>
            )}
          </Box>
        </Paper>
      </Grid>
    );
  };

  return (
    <Box sx={{
      p: 3,
      height: '100vh',
      overflow: 'auto',
      bgcolor: 'grey.50',
    }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Sensor Dashboard
      </Typography>
      <Grid container spacing={3}>
        {clientSensors.map(renderClientBox)}
      </Grid>
    </Box>
  );
};