/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { GridViewRounded, BarChartRounded, TableChartRounded } from '@mui/icons-material';

import WebSocketService from "../../../api/websocket";
import { ClientData, SortOption, ViewMode } from "../types/dashboard";
import { CombinedSensorTable } from "./charts/CombinedSensorTable";
import { ClientBox } from "./ClientBox";

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
      setClientSensors(data);
    };

    const unsubscribe = webSocketRef.current.subscribe(handleSensorData);
    
    return () => {
      unsubscribe();
      webSocketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    // Save sort options to localStorage when they change
    localStorage.setItem(SORT_OPTIONS_KEY, JSON.stringify(clientSortOptions));
  }, [clientSortOptions]);

  useEffect(() => {
    // Set up ResizeObserver
    resizeObserver.current = new ResizeObserver((entries) => {
      const newWidths: { [key: string]: number } = {};
      
      entries.forEach((entry) => {
        const clientId = (entry.target as HTMLElement).dataset.clientId;
        if (clientId) {
          newWidths[clientId] = entry.contentRect.width;
        }
      });

      setContainerWidths(prevWidths => {
        const hasChanges = Object.entries(newWidths).some(
          ([key, value]) => prevWidths[key] !== value
        );
        return hasChanges ? { ...prevWidths, ...newWidths } : prevWidths;
      });
    });

    return () => {
      resizeObserver.current?.disconnect();
    };
  }, []);

  const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newMode: ViewMode | null) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const handleSortChange = (clientId: string, newSortOption: SortOption) => {
    setClientSortOptions(prev => ({
      ...prev,
      [clientId]: newSortOption
    }));
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
      bgcolor: 'grey.50'
    }}>
      {renderViewControls()}
      {viewMode === 'table' ? (
        <CombinedSensorTable clients={clientSensors} />
      ) : viewMode === 'bar' ? (
        <Grid container spacing={3}>
          {clientSensors.map((client) => (
            <Grid item xs={12} md={6} lg={6} key={client.clientId}>
              <ClientBox
                client={client}
                containerWidth={containerWidths[client.clientId] || 0}
                sortOption={clientSortOptions[client.clientId] || 'name'}
                viewMode="bar"
                onSortChange={handleSortChange}
                containerRef={(el) => containerRefs.current[client.clientId] = el}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {clientSensors.map((client) => (
            <Grid item xs={12} md={6} lg={6} key={client.clientId}>
              <ClientBox
                client={client}
                containerWidth={containerWidths[client.clientId] || 0}
                sortOption={clientSortOptions[client.clientId] || 'name'}
                viewMode="grid"
                onSortChange={handleSortChange}
                containerRef={(el) => {
                  containerRefs.current[client.clientId] = el;
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};
