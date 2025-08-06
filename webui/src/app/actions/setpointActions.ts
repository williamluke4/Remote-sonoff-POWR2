"use server";

import mqtt from "mqtt";

export async function handleSetpointSubmit(formData: FormData) {
  try {
    const temperatureSetpoint = parseFloat(
      formData.get("setpoint") as string
    );

    const client = mqtt.connect(
      `mqtt://${process.env.MQTT_BROKER_HOST}:${process.env.MQTT_BROKER_PORT}`
    );

    client.on("connect", () => {
      client.publish(
        "powr2/command",
        `SETPOINT:${temperatureSetpoint}`,
        (err) => {
          if (err) {
            console.error("Failed to publish message:", err);
          } else {
            console.log("Message published successfully");
          }
          client.end();
        }
      );
    });

    client.on("error", (err) => {
      console.error("MQTT connection error:", err);
      client.end();
    });
  } catch (error) {
    console.error("Error in handleSetpointSubmit:", error);
  }
}