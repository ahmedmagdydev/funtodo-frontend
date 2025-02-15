import React from 'react';
import { Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { CombinedSensorTableProps } from '../../types/components';

export const CombinedSensorTable: React.FC<CombinedSensorTableProps> = ({ clients }) => {
  // Flatten all sensors from all clients into a single array
  const rows = clients.flatMap(client =>
    client.sensors.map((sensor, index) => ({
      id: `${client.clientId}-${sensor.sensorId}-${index}`,
      clientId: client.clientId,
      sensorId: sensor.sensorId,
      value: sensor.value,
    }))
  );

  const columns = [
    { field: 'clientId', headerName: 'Client', width: 130 },
    { field: 'sensorId', headerName: 'Sensor', width: 130 },
    { 
      field: 'value', 
      headerName: 'Value', 
      width: 130,
      renderCell: (params: any) => {
        return params.value != null ? params.value.toFixed(1) : 'N/A';
      }
    },
  ];

  return (
    <Box sx={{ 
      height: 'calc(100vh - 120px)', // Account for padding and controls
      width: '100%',
      mb: 2,
      '& .MuiDataGrid-root': {
        backgroundColor: 'white',
        borderRadius: 2,
      }
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25 },
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </Box>
  );
};
