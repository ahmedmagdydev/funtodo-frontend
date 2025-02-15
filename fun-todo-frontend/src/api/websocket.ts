import { ClientData, SensorData } from "../features/dashboard/types/dashboard";
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
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:3001";
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
        console.log("🚀 ~ WebSocketService ~ connect ~ data:", data);
        // Parse the type which contains username/clientId/sensorId
        if (data.type) {
          const [username, clientId, sensorId] = data.type.split("/");
          console.log("🚀 ~ WebSocketService ~ connect ~ username:", username);

          // Parse the message which contains the value
          const messageData = JSON.parse(data.message);

          this.updateClientSensors({
            clientId,
            sensorId,
            value: messageData.value,
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
    value: number;
  }) {
    const { clientId, sensorId, value } = data;
    const fullClientId = `${clientId}`;

    const clientIndex = this.clientSensors.findIndex(
      (client) => client.clientId === fullClientId
    );

    if (clientIndex === -1) {
      // Add new client with sensor
      this.clientSensors.push({
        clientId: fullClientId,
        sensors: [{ sensorId, value }],
      });
    } else {
      // Update existing client's sensor
      const client = this.clientSensors[clientIndex];
      const sensorIndex = client.sensors.findIndex(
        (sensor) => sensor.sensorId === sensorId
      );

      if (sensorIndex === -1) {
        // Add new sensor to existing client
        client.sensors.push({ sensorId, value });
      } else {
        // Update existing sensor
        client.sensors[sensorIndex].value = value;
      }
    }
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
