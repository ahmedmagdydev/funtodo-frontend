/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Paper, Typography, Grid, Box } from "@mui/material";
import { SENSOR_COLORS } from '../../constants/colors';
import { SensorBoxProps } from '../../types/components';

export const SensorBox: React.FC<SensorBoxProps> = ({ sensorId, values }) => {
  return (
    <Paper
      sx={{
        height: "100%",
        p: 1,
        bgcolor: (SENSOR_COLORS as any)[sensorId] || "#757575",
        color: "white",
        borderRadius: 2,
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1, textAlign: 'center' }}>
        {sensorId}
      </Typography>
      <Grid container spacing={1}>
        {values.map((value, index) => (
          <Grid item xs={6} key={`${sensorId}-${value.type}-${index}`}>
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                p: 0.5,
                borderRadius: 1,
                textAlign: 'center'
              }}
            >
              <Typography variant="caption" display="block">
                {value.type}
              </Typography>
              <Typography variant="body2">
                {typeof value.value === 'number' 
                  ? value.value.toFixed(1)
                  : value.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
