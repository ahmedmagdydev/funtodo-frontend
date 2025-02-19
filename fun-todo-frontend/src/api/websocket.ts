import { ClientData } from "../features/dashboard/types/dashboard";
import { getToken } from "./auth";

type WebSocketListener = (data: ClientData[]) => void;

class WebSocketService {
  private static instance: WebSocketService;
  private ws: WebSocket | null = null;
  private listeners: Set<WebSocketListener> = new Set();
  private clientSensors: ClientData[] = [];

  private constructor() {
    this.connect();
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  private connect() {
    const wsUrl = import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:3001";
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log("WebSocket connection established");
      if (this.ws) {
        // Send authentication token
        this.ws.send(
          JSON.stringify({
            token: getToken(),
          })
        );

        // Subscribe to all sensors
        this.ws.send(
          JSON.stringify({
            action: "subscribe",
            sensor: "#",
          })
        );
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Parse the type which contains username/clientId/sensorId
        if (data.values && data.topic) {
          const [username, clientId, sensorId] = data.topic.split("/");
          console.log("🚀 ~ WebSocketService ~ connect ~ username:", username);
          // Parse the values array which contains type and value pairs
          const values = JSON.parse(data.values);

          this.updateClientSensors({
            clientId,
            sensorId,
            values,
          });
          this.notifyListeners();
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
      setTimeout(() => {
        console.log("Attempting to reconnect...");
        this.connect();
      }, 5000);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  private updateClientSensors(data: {
    clientId: string;
    sensorId: string;
    values: { type: string; value: number }[];
  }) {
    const { clientId, sensorId, values } = data;
    const fullClientId = `${clientId}`;

    // Create a new array to ensure state updates are detected
    const updatedClientSensors = [...this.clientSensors];
    const clientIndex = updatedClientSensors.findIndex(
      (client) => client.clientId === fullClientId
    );

    if (clientIndex === -1) {
      // Add new client with sensor
      updatedClientSensors.push({
        clientId: fullClientId,
        sensors: [{ sensorId, values }],
      });
    } else {
      // Update existing client's sensor
      const client = { ...updatedClientSensors[clientIndex] }; // Create a new client object
      const sensorIndex = client.sensors.findIndex(
        (sensor) => sensor.sensorId === sensorId
      );

      if (sensorIndex === -1) {
        // Add new sensor to existing client
        client.sensors = [...client.sensors, { sensorId, values }];
      } else {
        // Update existing sensor
        client.sensors = client.sensors.map((sensor) =>
          sensor.sensorId === sensorId ? { ...sensor, values } : sensor
        );
      }
      updatedClientSensors[clientIndex] = client;
    }

    this.clientSensors = updatedClientSensors;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      listener(this.clientSensors);
    });
  }

  public subscribe(listener: WebSocketListener): () => void {
    this.listeners.add(listener);
    // Initial data push
    listener(this.clientSensors);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  public disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public getClientSensors(): ClientData[] {
    return this.clientSensors;
  }
}

export default WebSocketService;
