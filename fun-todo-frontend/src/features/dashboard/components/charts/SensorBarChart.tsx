import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';
import { SensorBarChartProps } from '../../types/components';
import _ from 'lodash';

export const SensorBarChart: React.FC<SensorBarChartProps> = ({ client }) => {
  const [chartKey, setChartKey] = useState(Date.now());
  const [chartData, setChartData] = useState<Array<{ value: number; sensor: string }>>([]);

  useEffect(() => {
    console.log('Sensor changes detected');
    setChartKey(Date.now());
    setChartData(client.sensors.map(sensor => ({
      value: sensor.value,
      sensor: sensor.sensorId,
    })));
  }, [client.sensors]);

  return (
    <Box sx={{ height: 300, mb: 2 }}>
      <BarChart
        key={chartKey}
        dataset={chartData}
        xAxis={[{ scaleType: 'band', dataKey: 'sensor' }]}
        series={[{ dataKey: 'value', label: 'Value', }]}
        height={280}
      />
    </Box>
  );
};