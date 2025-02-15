import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { SensorBarChartProps } from '../../types/components';
import _ from 'lodash';

export const SensorBarChart: React.FC<SensorBarChartProps> = ({ client }) => {
  const [chartKey, setChartKey] = useState(Date.now());

  // Get unique types across all sensors
  const allTypes = Array.from(new Set(
    client.sensors.flatMap(sensor => sensor.values.map(v => v.type))
  )).sort();

  // Transform data for the chart
  const chartData = client.sensors.map(sensor => {
    const baseData = { sensor: sensor.sensorId };
    // Add each type's value as a separate property
    sensor.values.forEach(v => {
      (baseData as any)[v.type] = v.value;
    });
    return baseData;
  });

  useEffect(() => {
    console.log('Sensor changes detected');
    setChartKey(Date.now());
  }, [client.sensors]);

  // Create series for each type with different colors
  const typeColors = {
    't': '#FF6B6B',  // Red for temperature
    'h': '#4ECDC4',  // Cyan for humidity
    // Add more colors for other types as needed
  };

  const series = allTypes.map(type => ({
    dataKey: type,
    label: type === 't' ? 'Temperature' : type === 'h' ? 'Humidity' : type,
    color: (typeColors as any)[type] || '#757575',
  }));

  return (
    <Box sx={{ height: 300, mb: 2 }}>
      <BarChart
        key={chartKey}
        dataset={chartData}
        xAxis={[{ 
          scaleType: 'band', 
          dataKey: 'sensor',
          label: 'Sensors'
        }]}
        series={series}
        height={280}
        slotProps={{
          legend: {
            hidden: false,
            position: { vertical: 'top', horizontal: 'right' }
          }
        }}
      />
    </Box>
  );
};