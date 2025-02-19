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
    // Sort by the first value of each sensor as default
    const aValue = a.values[0]?.value || 0;
    const bValue = b.values[0]?.value || 0;
    
    // Handle string values (with units) by extracting the numeric part
    const aNum = typeof aValue === 'string' ? parseFloat(aValue) : aValue;
    const bNum = typeof bValue === 'string' ? parseFloat(bValue) : bValue;
    
    return bNum - aNum;
  });

  // Create layout for grid items
  const layout = sortedSensors.map((sensor, i) => ({
    i: `${client.clientId}-${sensor.sensorId}`,
    x: i % 4,  // 4 columns per row to make boxes bigger
    y: Math.floor(i / 4),  // New row every 4 items
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
            cols={4}
            rowHeight={160}
            width={containerWidth}
            isDraggable={false}
            isResizable={false}
            margin={[10, 10]}
          >
            {sortedSensors.map((sensor) => (
              <div key={`${client.clientId}-${sensor.sensorId}`}>
                <SensorBox
                  sensorId={sensor.sensorId}
                  values={sensor.values}
                />
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
