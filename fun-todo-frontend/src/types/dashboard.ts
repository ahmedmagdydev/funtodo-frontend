export type GroupBy = "type" | "clientId";

export interface TimeValue {
  timestamp: number;
  value: number;
}

export interface SensorData {
  clientId: string;
  type: string;
  values: TimeValue[];
}

export interface MqttMessage {
  clientId: string;
  type: string;
  value: number;
}
