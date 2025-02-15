import React from 'react';
import { Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { SensorTableProps } from '../../types/components';

 

export const SensorTable: React.FC<SensorTableProps> = ({ client }) => {
  const columns = [
    { field: 'sensorId', headerName: 'Sensor', width: 130 },
    { field: 'value', headerName: 'Value', width: 130 },
  ];

  return (
    <Box sx={{ height: 400, mb: 2 }}>
      <DataGrid
        rows={client.sensors}
        columns={columns}
        getRowId={(row) => row.sensorId}
        disableRowSelectionOnClick
      />
    </Box>
  );
};
