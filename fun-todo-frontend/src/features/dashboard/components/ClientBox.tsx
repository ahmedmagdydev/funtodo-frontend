import React from 'react';
import { Box, Paper, Typography, Stack, Grid } from "@mui/material";
import RGL, { WidthProvider } from "react-grid-layout";
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { ClientBoxProps } from '../types/components';
import { SensorBox } from './charts/SensorBox';
import { SensorBarChart } from './charts/SensorBarChart';
import { SensorTable } from './charts/SensorTable';

const ReactGridLayout = WidthProvider(RGL);

export const ClientBox: React.FC<ClientBoxProps> = ({
  client,
  containerWidth,
  sortOption,
  viewMode,
  containerRef,
}) => {
  // Sort sensors based on the selected option
  const sortedSensors = [...client.sensors].sort((a, b) => {
    if (sortOption === 'name') {
      return a.sensorId.localeCompare(b.sensorId);
    }
    return b.value - a.value;
  });

  // Create layout for grid items
  const layout = sortedSensors.map((sensor, i) => ({
    i: `${client.clientId}-${sensor.sensorId}`,
    x: i % 8,  // 8 columns per row
    y: Math.floor(i / 8),  // New row every 8 items
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
        return (
          <ReactGridLayout
            className="layout"
            layout={layout}
            cols={8}
            rowHeight={80}
            width={containerWidth}
            isDraggable={false}
            isResizable={false}
            margin={[8, 8]}
            containerPadding={[8, 8]}
            compactType={null}
            preventCollision={true}
          >
            {sortedSensors.map((sensor) => (
              <div key={`${client.clientId}-${sensor.sensorId}`}>
                <SensorBox sensorId={sensor.sensorId} value={sensor.value} />
              </div>
            ))}
          </ReactGridLayout>
        );
    }
  };

  return (
    <Grid item xs={12} md={12} lg={12}>
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
          {/* <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={sortOption}
              onChange={(e) => onSortChange(client.clientId, e.target.value as 'name' | 'value')}
              variant="outlined"
            >
              <MenuItem value="name">Sort by Name</MenuItem>
              <MenuItem value="value">Sort by Value</MenuItem>
            </Select>
          </FormControl> */}
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
