import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Tooltip,

  SelectChangeEvent,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import {
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  RestartAlt as RestartAltIcon
} from "@mui/icons-material";
import { GridLayout } from "./GridLayout";
import { GaugeChart } from "./charts/GaugeChart";
import { dashboardStyles } from "../styles/dashboard.styles";
import { SensorData, GroupBy } from "../types/dashboard";
import { useMqttSubscription } from "../hooks/useMqttSubscription";

export const Dashboard: React.FC = () => {
  const [groupBy, setGroupBy] = useState<GroupBy>("type");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [layouts, setLayouts] = useState({});

  // Subscribe to MQTT topics
  const { data: mqttData } = useMqttSubscription([
    "sensors/+/temperature",
    "sensors/+/humidity",
    "sensors/+/pressure",
  ]);

  // Update sensor data when new MQTT messages arrive
  useEffect(() => {
    if (mqttData) {
      setSensorData((prev) => {
        const newData = [...prev];
        const timestamp = new Date().getTime();
        
        // Update or add new sensor data
        const index = newData.findIndex(
          (d) => d.clientId === mqttData.clientId && d.type === mqttData.type
        );
        
        if (index !== -1) {
          newData[index].values.push({ timestamp, value: mqttData.value });
          // Keep only last 100 values
          if (newData[index].values.length > 100) {
            newData[index].values.shift();
          }
        } else {
          newData.push({
            clientId: mqttData.clientId,
            type: mqttData.type,
            values: [{ timestamp, value: mqttData.value }],
          });
        }
        
        return newData;
      });
    }
  }, [mqttData]);

  const handleGroupByChange = (event: SelectChangeEvent<GroupBy>) => {
    setGroupBy(event.target.value as GroupBy);
  };

  const handleLayoutChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLayout: "grid" | "list"
  ) => {
    if (newLayout !== null) {
      setLayout(newLayout);
    }
  };

  // Load saved layouts from localStorage on mount
  useEffect(() => {
    const savedLayouts = localStorage.getItem("dashboardLayouts");
    if (savedLayouts) {
      try {
        setLayouts(JSON.parse(savedLayouts));
      } catch (e) {
        console.error("Error loading saved layouts:", e);
      }
    }
  }, []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleLayoutSave = (key: string, newLayout: any) => {
    const updatedLayouts = {
      ...layouts,
      [key]: newLayout,
    };
    console.log("🚀 ~ handleLayoutSave ~ updatedLayouts:", updatedLayouts)
    setLayouts(updatedLayouts);
    localStorage.setItem("dashboardLayouts", JSON.stringify(updatedLayouts));
  };


  // Group sensors based on selected grouping
  const groupedSensors = React.useMemo(() => {
    const groups: { [key: string]: SensorData[] } = {};
    
    sensorData.forEach((sensor) => {
      const key = groupBy === "type" ? sensor.type : sensor.clientId;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(sensor);
    });
    
    return groups;
  }, [sensorData, groupBy]);

  // Get sensor ranges based on type
  const getSensorRanges = (type: string): { min: number; max: number } => {
    switch (type) {
      case "temperature":
        return { min: 0, max: 50 }; // Temperature in Celsius
      case "humidity":
        return { min: 0, max: 100 }; // Humidity in percentage
      case "pressure":
        return { min: 900, max: 1100 }; // Pressure in hPa
      default:
        return { min: 0, max: 100 };
    }
  };

  // Render chart based on sensor type and data
  const renderChart = (sensor: SensorData) => {
    const { min, max } = getSensorRanges(sensor.type);
    const currentValue = sensor.values[sensor.values.length - 1]?.value ?? 0;

    return (
      <Card 
        sx={{ 
          p: 3, 
          height: '100%',
          minHeight: '360px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography 
          variant="h6" 
          gutterBottom 
          sx={{ 
            textAlign: 'center',
            mb: 2,
          }}
        >
          {sensor.type.charAt(0).toUpperCase() + sensor.type.slice(1)}
          {groupBy === "type" && ` - ${sensor.clientId}`}
        </Typography>
        <Box sx={{ 
          flex: 1,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
        }}>
          <GaugeChart
            value={currentValue}
            min={min}
            max={max}
            title={`${currentValue.toFixed(1)}${sensor.type === "temperature" ? "°C" : sensor.type === "humidity" ? "%" : " hPa"}`}
          />
        </Box>
      </Card>
    );
  };

  // Render dashboard content
  const renderDashboardContent = () => {
    return Object.entries(groupedSensors).map(([key, sensors]) => (
      <Box key={key} sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {groupBy === "type" ? `${key} Sensors` : `Client ${key}`}
        </Typography>
        {layout === "grid" ? (
          <GridLayout
            items={sensors}
            renderItem={renderChart}
            onLayoutChange={(newLayout) => handleLayoutSave(key, newLayout)}
            savedLayout={layouts[key]}
            itemWidth={3}
            itemHeight={6}
            totalCols={12}
          />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {sensors.map((sensor) => (
              <Box key={`${sensor.clientId}-${sensor.type}`}>
                {renderChart(sensor)}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    ));
  };

  return (
    <Box sx={{
      ...dashboardStyles.container,
      height: '100vh',
      overflow: 'hidden', // Prevent double scrollbars
    }}>
      {/* Header */}
      <Box sx={dashboardStyles.header}>
        <Typography variant="h5">Sensor Dashboard</Typography>
        <Box sx={dashboardStyles.controls}>
        <Tooltip title="Reset Layout">
            <IconButton onClick={() => {
              localStorage.removeItem("dashboardLayouts");
              setLayouts({});
            }}>
              <RestartAltIcon />
            </IconButton>
          </Tooltip>
          <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
            <Select value={groupBy} onChange={handleGroupByChange}>
              <MenuItem value="type">Group by Type</MenuItem>
              <MenuItem value="clientId">Group by Client</MenuItem>
            </Select>
          </FormControl>
          <ToggleButtonGroup
            value={layout}
            exclusive
            onChange={handleLayoutChange}
            size="small"
          >
            <ToggleButton value="grid">
              <Tooltip title="Grid View">
                <ViewModuleIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="list">
              <Tooltip title="List View">
                <ViewListIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
         

        </Box>
      </Box>

      {/* Dashboard Content */}
      <Box sx={{
        ...dashboardStyles.gridContainer,
        flex: 1,
        overflowY: 'auto',
        p: 3,
      }}>
        {renderDashboardContent()}
      </Box>
    </Box>
  );
};
