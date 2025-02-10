import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  Stack,
} from "@mui/material";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import WebSocketService from '../services/webSocket';
import { ClientData } from "../types/dashboard";

type SortOption = 'name' | 'value';

const SENSOR_COLORS = {
  temperature: "#ff9800",
  humidity: "#2196f3",
  pressure: "#4caf50",
};

const SORT_OPTIONS_KEY = 'dashboard_sort_options';

export const Dashboard: React.FC = () => {
  const [clientSensors, setClientSensors] = useState<ClientData[]>([]);
  const [containerWidths, setContainerWidths] = useState<{ [key: string]: number }>({});
  const [clientSortOptions, setClientSortOptions] = useState<{ [key: string]: SortOption }>(() => {
    // Initialize from localStorage
    const savedOptions = localStorage.getItem(SORT_OPTIONS_KEY);
    return savedOptions ? JSON.parse(savedOptions) : {};
  });
  const containerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const resizeObserver = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const webSocketService = WebSocketService.getInstance();
    
    const unsubscribe = webSocketService.subscribe((data) => {
      setClientSensors(data);
      // Initialize sort options for new clients without affecting existing ones
      setClientSortOptions(prev => {
        const newSortOptions = { ...prev };
        let hasChanges = false;
        
        data.forEach(client => {
          if (!newSortOptions[client.clientId]) {
            newSortOptions[client.clientId] = 'name';
            hasChanges = true;
          }
        });
        
        if (hasChanges) {
          localStorage.setItem(SORT_OPTIONS_KEY, JSON.stringify(newSortOptions));
        }
        return newSortOptions;
      });
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
          // console.log(clientId)
          resizeObserver.current?.observe(element);
        }
      });
    }
  }, [clientSensors]);

  const handleSortChange = (clientId: string, sortOption: SortOption) => {
    setClientSortOptions(prev => {
      const newOptions = {
        ...prev,
        [clientId]: sortOption
      };
      localStorage.setItem(SORT_OPTIONS_KEY, JSON.stringify(newOptions));
      return newOptions;
    });
  };

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
    const sortOption = clientSortOptions[client.clientId] || 'name';
    
    const sortedSensors = [...client.sensors].sort((a, b) => {
      if (sortOption === 'name') {
        return a.sensorId.localeCompare(b.sensorId);
      }
      return b.value - a.value;
    });

    const containerWidth = containerWidths[client.clientId] || 0;
    
    // Calculate optimal number of columns
    // Minimum width for each sensor box (including margins)
    const minSensorWidth = 80; // px
    const margin = 10; // px
    const totalMargin = margin * 2; // left and right margins
    const availableWidth = containerWidth - 32; // subtract container padding
    const optimalCols = Math.max(2, Math.floor(availableWidth / (minSensorWidth + totalMargin)));
    
    const layout = sortedSensors.map((sensor, index) => ({
      i: `${client.clientId}-${sensor.sensorId}`,
      x: index % optimalCols,
      y: Math.floor(index / optimalCols),
      w: 1,
      h: 1,
    }));

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
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {client.clientId}
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select
                value={sortOption}
                onChange={(e) => handleSortChange(client.clientId, e.target.value as SortOption)}
                variant="outlined"
              >
                <MenuItem value="name">Sort by Name</MenuItem>
                <MenuItem value="value">Sort by Value</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Box 
            ref={(el: HTMLDivElement | null) => {
              containerRefs.current[client.clientId] = el;
            }}
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
                cols={optimalCols}
                rowHeight={80}
                width={containerWidth - 32}
                isDraggable={true}
                isResizable={false}
                margin={[margin, margin]}
                containerPadding={[0, 0]}
              >
                {sortedSensors.map((sensor) => (
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