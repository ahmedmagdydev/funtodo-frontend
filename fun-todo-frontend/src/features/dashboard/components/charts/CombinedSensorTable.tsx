import React from 'react';
import { Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { CombinedSensorTableProps } from '../../types/components';

export const CombinedSensorTable: React.FC<CombinedSensorTableProps> = ({ clients }) => {
  // Flatten all sensors and their values from all clients into a single array
  const rows = clients.flatMap(client =>
    client.sensors.flatMap(sensor =>
      sensor.values.map((value, index) => {
        console.log('Processing value:', value); // Debug log
        return {
          id: `${client.clientId}-${sensor.sensorId}-${value.type}-${index}`,
          clientId: client.clientId,
          sensorId: sensor.sensorId,
          type: value.type,
          value: value.value,
        };
      })
    )
  );

  console.log('Generated rows:', rows); // Debug log

  const columns = [
    { field: 'clientId', headerName: 'Client', width: 130 },
    { field: 'sensorId', headerName: 'Sensor', width: 130 },
    { 
      field: 'type', 
      headerName: 'Type', 
      width: 130,
      valueFormatter: (params: any) => {
        console.log('Type params:', params); // Debug log
        return params.value === 't' ? 'Temperature' : 
               params.value === 'h' ? 'Humidity' : 
               params.value;
      }
    },
    { 
      field: 'value', 
      headerName: 'Value', 
      width: 130,
      valueFormatter: (params: any) => {
        console.log('Value params:', params); // Debug log
        // if (params.value === undefined || params.value === null) return 'N/A';
        return Number(params).toFixed(2);
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
          sorting: {
            sortModel: [{ field: 'clientId', sort: 'asc' }],
          },
        }}
        pageSizeOptions={[10, 25, 50, 100]}
      />
    </Box>
  );
};
