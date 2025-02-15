import React from 'react';
import { Box, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { GridViewRounded, BarChartRounded, TableChartRounded } from '@mui/icons-material';
import { ViewControlsProps } from '../types/components';

 

export const ViewControls: React.FC<ViewControlsProps> = ({ viewMode, onViewChange }) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={onViewChange}
        aria-label="view mode"
        size="small"
      >
        <ToggleButton value="grid" aria-label="grid view">
          <GridViewRounded />
        </ToggleButton>
        <ToggleButton value="bar" aria-label="bar chart">
          <BarChartRounded />
        </ToggleButton>
        <ToggleButton value="table" aria-label="table view">
          <TableChartRounded />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
