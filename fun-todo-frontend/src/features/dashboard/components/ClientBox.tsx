import React from 'react';
import { Box, Paper, Typography, Stack, FormControl, Select, MenuItem, Grid } from "@mui/material";
import GridLayout from "react-grid-layout";
import { ClientBoxProps } from '../types/components';
import { SensorBox } from './charts/SensorBox';
import { SensorBarChart } from './charts/SensorBarChart';
import { SensorTable } from './charts/SensorTable';

export const ClientBox: React.FC<ClientBoxProps> = ({
  client,
  containerWidth,
  sortOption,
  viewMode,
  onSortChange,
  containerRef,
}) => {
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

  const renderContent = () => {
    switch (viewMode) {
      case 'bar':
        return <SensorBarChart client={client} />;
      case 'table':
        return <SensorTable client={client} />;
      default:
        return containerWidth > 0 ? (
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
                <SensorBox sensorId={sensor.sensorId} value={sensor.value} />
              </div>
            ))}
          </GridLayout>
        ) : null;
    }
  };

  return (
    <Grid item xs={12} md={6} lg={6}>
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
              onChange={(e) => onSortChange(client.clientId, e.target.value as 'name' | 'value')}
              variant="outlined"
            >
              <MenuItem value="name">Sort by Name</MenuItem>
              <MenuItem value="value">Sort by Value</MenuItem>
            </Select>
          </FormControl>
        </Stack>
        <Box 
          ref={containerRef}
          data-client-id={client.clientId}
          sx={{ 
            bgcolor: 'grey.100', 
            p: 2, 
            borderRadius: 1,
            minHeight: '120px'
          }}
        >
          {renderContent()}
        </Box>
      </Paper>
    </Grid>
  );
};
