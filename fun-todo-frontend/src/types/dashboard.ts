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
