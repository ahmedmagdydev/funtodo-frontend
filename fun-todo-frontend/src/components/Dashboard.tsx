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
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GridViewRounded, BarChartRounded, TableChartRounded } from '@mui/icons-material';
import { BarChart } from '@mui/x-charts/BarChart';
import { DataGrid } from '@mui/x-data-grid';

import WebSocketService from '../services/webSocket';
import { ClientData } from "../types/dashboard";

type SortOption = 'name' | 'value';
type ViewMode = 'grid' | 'bar' | 'table';

const SENSOR_COLORS = {
  temperature: "#ff9800",
  humidity: "#2196f3",
  pressure: "#4caf50",
};

const SORT_OPTIONS_KEY = 'dashboard_sort_options';

export const Dashboard: React.FC = () => {
  const [clientSensors, setClientSensors] = useState<ClientData[]>([]);
  const [containerWidths, setContainerWidths] = useState<{ [key: string]: number }>({});
  const [clientSortOptions, setClientSortOptions] = useState<Record<string, SortOption>>(() => {
    // Initialize from localStorage
    const savedOptions = localStorage.getItem(SORT_OPTIONS_KEY);
    return savedOptions ? JSON.parse(savedOptions) : {};
  });
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const containerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const resizeObserver = useRef<ResizeObserver | null>(null);
  const webSocketRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    webSocketRef.current = WebSocketService.getInstance();
    
    const handleSensorData = (data: ClientData[]) => {
      setClientSensors(prevData => {
        // Update existing data while preserving structure
        const updatedData = data.map(newClient => {
          const existingClient = prevData.find(c => c.clientId === newClient.clientId);
          if (existingClient) {
            // Merge new sensor data with existing data
            return {
              ...newClient,
              sensors: newClient.sensors.map(sensor => {
                const existingSensor = existingClient.sensors.find(s => s.sensorId === sensor.sensorId);
                return {
                  ...sensor,
                  value: sensor.value // Use new value
                };
              })
            };
          }
          return newClient;
        });
        return updatedData;
      });

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
    };

    const unsubscribe = webSocketRef.current.subscribe(handleSensorData);
    
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Only run on mount/unmount

  // Initialize ResizeObserver once
  useEffect(() => {
    resizeObserver.current = new ResizeObserver((entries) => {
      const newWidths: { [key: string]: number } = {};
      entries.forEach((entry) => {
        const clientId = entry.target.getAttribute('data-client-id');
        if (clientId) {
          newWidths[clientId] = entry.contentRect.width;
        }
      });
      setContainerWidths(prev => ({ ...prev, ...newWidths }));
    });

    return () => {
      if (resizeObserver.current) {
        resizeObserver.current.disconnect();
      }
    };
  }, []); // Only create observer once

  // Update observers when clients change or view mode changes
  useEffect(() => {
    if (resizeObserver.current && viewMode === 'grid') {
      // Disconnect existing observations
      resizeObserver.current.disconnect();
      
      // Observe all current container refs
      Object.entries(containerRefs.current).forEach(([clientId, element]) => {
        if (element) {
          resizeObserver.current?.observe(element);
          // Initial width measurement
          setContainerWidths(prev => ({
            ...prev,
            [clientId]: element.offsetWidth
          }));
        }
      });
    }
  }, [clientSensors, viewMode]);

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

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
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

  const renderBarChart = (client: ClientData) => {
    const data = client.sensors.map(sensor => ({
      value: sensor.value,
      sensor: sensor.sensorId,
    }));

    return (
      <Box sx={{ height: 300, mb: 2 }}>
        <BarChart
          dataset={data}
          xAxis={[{ scaleType: 'band', dataKey: 'sensor' }]}
          series={[{ dataKey: 'value', label: 'Value' }]}
          height={280}
        />
      </Box>
    );
  };

  const renderTableView = (client: ClientData) => {
    const columns = [
      { field: 'sensorId', headerName: 'Sensor', width: 130 },
      { field: 'value', headerName: 'Value', width: 130 },
    ];

    return (
      <Box sx={{ height: 400, mb: 2 }}>
        <DataGrid
          rows={client.sensors}
          columns={columns}
          getRowId={(row) => row.sensorId}
          disableRowSelectionOnClick
        />
      </Box>
    );
  };

  const renderClientBox = (client: ClientData) => {
    const containerWidth = containerWidths[client.clientId] || 0;
    const sortOption = clientSortOptions[client.clientId] || 'name';
    
    // Sort sensors based on the selected option
    const sortedSensors = [...client.sensors].sort((a, b) => {
      if (sortOption === 'name') {
        return a.sensorId.localeCompare(b.sensorId);
      }
      return b.value - a.value;
    });

    // Calculate optimal number of columns based on container width
    const optimalCols = Math.max(2, Math.floor((containerWidth - 32) / 120));
    const margin = 10;

    // Create layout for grid items
    const layout = sortedSensors.map((sensor, index) => ({
      i: `${client.clientId}-${sensor.sensorId}`,
      x: index % optimalCols,
      y: Math.floor(index / optimalCols),
      w: 1,
      h: 1,
    }));

    switch (viewMode) {
      case 'bar':
        return renderBarChart(client);
      case 'table':
        return renderTableView(client);
      default:
        return (
          <Grid item xs={12} md={6} lg={6} key={client.clientId}>
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
                ref={(el) => {
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
    }
  };

  const renderViewControls = () => (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={handleViewChange}
        aria-label="view mode"
        size="small"
      >
        <ToggleButton value="grid" aria-label="grid view">
          <GridViewRounded />
        </ToggleButton>
        <ToggleButton value="bar" aria-label="bar chart">
          <BarChartRounded />
        </ToggleButton>
        <ToggleButton value="table" aria-label="table view">
          <TableChartRounded />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );

  return (
    <Box sx={{
      p: 3,
      height: '100vh',
      overflow: 'auto',
      bgcolor: 'grey.50',
    }}>
      {renderViewControls()}
      <Grid container spacing={3}>
        {clientSensors.map(renderClientBox)}
      </Grid>
    </Box>
  );
};