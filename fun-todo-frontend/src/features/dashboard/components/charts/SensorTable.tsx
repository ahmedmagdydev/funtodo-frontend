import React from 'react';
import { Box } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { SensorTableProps } from '../../types/components';

 

export const SensorTable: React.FC<SensorTableProps> = ({ client }) => {
  const columns = [
    { field: 'sensorId', headerName: 'Sensor', width: 130 },
    { field: 'type', headerName: 'Type', width: 130,
      valueFormatter: (params: any) => 
        params.value === 't' ? 'Temperature' : 
        params.value === 'h' ? 'Humidity' : 
        params.value
    },
    { field: 'value', headerName: 'Value', width: 130,
      valueFormatter: (params: any) => params.value.toFixed(2)
    },
  ];

  // Transform the data to show each sensor-type combination as a row
  const rows = client.sensors.flatMap(sensor =>
    sensor.values.map((value, index) => ({
      id: `${sensor.sensorId}-${value.type}-${index}`,
      sensorId: sensor.sensorId,
      type: value.type,
      value: value.value,
    }))
  );

  return (
    <Box sx={{ height: 400, mb: 2 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        disableRowSelectionOnClick
        initialState={{
          sorting: {
            sortModel: [{ field: 'sensorId', sort: 'asc' }],
          },
        }}
      />
    </Box>
  );
};
