import { ClientData, SensorData } from "../types/dashboard";

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
    this.ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

    this.ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const typeString: string = data.type;
        const messagePayload = JSON.parse(data.message);
        const value: number = messagePayload.value;

        const parts = typeString.split("/");
        if (parts.length < 3) {
          console.error("Unexpected type format:", typeString);
          return;
        }
        const clientId = parts[1];
        const sensorId = parts[2];

        this.updateClientSensors(clientId, sensorId, value);
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
      // Attempt to reconnect after a delay
      setTimeout(() => this.connect(), 5000);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  private updateClientSensors(
    clientId: string,
    sensorId: string,
    value: number
  ) {
    const clientIndex = this.clientSensors.findIndex(
      (client) => client.clientId === clientId
    );

    if (clientIndex === -1) {
      this.clientSensors = [
        ...this.clientSensors,
        { clientId, sensors: [{ sensorId, value }] },
      ];
    } else {
      const clientData = this.clientSensors[clientIndex];
      const sensorIndex = clientData.sensors.findIndex(
        (sensor) => sensor.sensorId === sensorId
      );

      const updatedSensors: SensorData[] =
        sensorIndex === -1
          ? [...clientData.sensors, { sensorId, value }]
          : clientData.sensors.map((sensor, index) =>
              index === sensorIndex ? { ...sensor, value } : sensor
            );

      this.clientSensors = this.clientSensors.map((client, index) =>
        index === clientIndex ? { ...client, sensors: updatedSensors } : client
      );
    }

    // Notify all listeners of the update
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.clientSensors));
  }

  public subscribe(listener: WebSocketListener): () => void {
    this.listeners.add(listener);
    // Immediately send current state to new subscriber
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

  public getCurrentData(): ClientData[] {
    return this.clientSensors;
  }
}

export default WebSocketService;
