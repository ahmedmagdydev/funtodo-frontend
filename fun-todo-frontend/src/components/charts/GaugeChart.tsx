import React from "react";
import { Gauge as MuiGaugeChart } from '@mui/x-charts/Gauge';
import { Box, Typography, useTheme } from "@mui/material";

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  title?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value = 0,
  min = 0,
  max = 100,
  title,
}) => {
  const theme = useTheme();
  const normalizedValue = Math.max(min, Math.min(max, value));

  const getColor = (value: number) => {
    const percentage = ((value - min) / (max - min)) * 100;
    if (percentage <= 30) return theme.palette.success.main;
    if (percentage <= 70) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        minHeight: '300px',
        gap: 2, 
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <MuiGaugeChart
          startAngle={-117}
          endAngle={117}
          height={280}
          width={280}
          value={normalizedValue}
          valueMin={min}
          valueMax={max}
          sx={{
            '& .MuiChartsLegend-root': {
              display: 'none',
            },
            '& .MuiChartsGauge-track': {
              opacity: 0.2,
              strokeWidth: 20,
            },
            '& .MuiChartsGauge-indicator': {
              stroke: getColor(normalizedValue),
              strokeWidth: 20,
            },
          }}
        />
      </Box>
      {title && (
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: getColor(normalizedValue), 
          }}
        >
          {title}
        </Typography>
      )}
    </Box>
  );
};
