/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Paper, Typography } from "@mui/material";
import { SENSOR_COLORS } from '../../constants/colors';
import { SensorBoxProps } from '../../types/components';

export const SensorBox: React.FC<SensorBoxProps> = ({ sensorId, value }) => {
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
