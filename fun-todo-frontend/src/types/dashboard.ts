export type GroupBy = "type" | "clientId";

export interface MqttMessage {
  clientId: string;
  type: string;
  value: number;
}

// types.ts
export interface SensorData {
  sensorId: string;
  value: number;
}

export interface ClientData {
  clientId: string;
  sensors: SensorData[];
}

export type ViewMode = "grid" | "bar" | "table";

export interface ViewConfig {
  mode: ViewMode;
  showLabels?: boolean;
}
