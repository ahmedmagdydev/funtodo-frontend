import { useState, useEffect } from "react";
import { MqttMessage } from "../types/dashboard";

// Simulated sensor clients and types
const SENSOR_CLIENTS = [
  "client1",
  "client2",
  "client3",
  "client4",
  "client5",
  "client6",
];
// const SENSOR_TYPES = ["temperature", "humidity", "pressure"];

// Helper function to generate a concrete topic from a pattern
const generateConcreteTopics = (topicPattern: string): string[] => {
  if (topicPattern.includes("+")) {
    const [prefix, type] = topicPattern.split("/");
    if (type === "temperature" || type === "humidity" || type === "pressure") {
      return SENSOR_CLIENTS.map((clientId) => `${prefix}/${clientId}/${type}`);
    }
    return [];
  }
  return [topicPattern];
};

// Simulated MQTT subscription hook for development
export const useMqttSubscription = (topicPatterns: string[]) => {
  const [data, setData] = useState<MqttMessage | null>(null);
  // const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log(
      "Starting simulated MQTT subscription for topics:",
      topicPatterns
    );

    // Convert patterns to concrete topics
    const concreteTopics = topicPatterns.flatMap(generateConcreteTopics);

    if (concreteTopics.length === 0) {
      console.warn("No valid topics found for the given patterns");
      return;
    }

    // Generate random data for each topic every 2 seconds
    const interval = setInterval(() => {
      // Randomly select a topic
      const topic =
        concreteTopics[Math.floor(Math.random() * concreteTopics.length)];

      // Extract clientId and type from topic (e.g., "sensors/client1/temperature")
      const [, clientId, type] = topic.split("/");

      // Generate random value based on the sensor type
      let value: number;
      switch (type) {
        case "temperature":
          value = 20 + Math.random() * 15; // Temperature between 20-35°C
          break;
        case "humidity":
          value = 30 + Math.random() * 40; // Humidity between 30-70%
          break;
        case "pressure":
          value = 980 + Math.random() * 40; // Pressure between 980-1020 hPa
          break;
        default:
          value = Math.random() * 100;
      }

      setData({
        clientId,
        type,
        value: Number(value.toFixed(2)),
      });
    }, 500);

    // Cleanup interval on unmount
    return () => {
      console.log("Cleaning up simulated MQTT subscription");
      clearInterval(interval);
    };
  }, [topicPatterns.join(",")]); // Only recreate when topics change

  return { data };
};
