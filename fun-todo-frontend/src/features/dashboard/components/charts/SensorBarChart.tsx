import React from 'react';
import { Box } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { SensorBarChartProps } from '../../types/components';
 

export const SensorBarChart: React.FC<SensorBarChartProps> = ({ client }) => {
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
