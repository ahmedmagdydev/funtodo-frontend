export type GroupBy = "type" | "clientId";

export interface MqttMessage {
  clientId: string;
  type: string;
  value: number;
}

export interface SensorValue {
  type: string;
  value: number;
}

export interface SensorData {
  sensorId: string;
  values: SensorValue[];
}

export interface ClientData {
  clientId: string;
  sensors: SensorData[];
}

export type ViewMode = "grid" | "bar" | "table";

export type SortOption = "name" | "value";
