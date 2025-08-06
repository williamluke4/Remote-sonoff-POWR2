import { InfluxDB } from "@influxdata/influxdb-client";
import { handleSetpointSubmit } from "./actions/setpointActions";
import ClientSetpointForm from "./client_setpoint_form";
import Dashboard from "./dashboard";

const influxdb = new InfluxDB({
  url: `http://${process.env.INFLUX_HOST}:8086`,
  token: process.env.INFLUX_TOKEN as string,
});

export async function fetchData() {
  "use server";

  const queryApi = influxdb.getQueryApi(process.env.INFLUX_ORG as string);

  // Fetch all devices
  const devicesQuery = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: -1h)
      |> filter(fn: (r) => r["_measurement"] == "mqtt_consumer")
      |> filter(fn: (r) => r["_field"] == "active_power" or r["_field"] == "apparent_power" or r["_field"] == "current" or r["_field"] == "energy" or r["_field"] == "reactive_power" or r["_field"] == "relay_state" or r["_field"] == "temperature" or r["_field"] == "voltage" or r["_field"] == "temperature_setpoint")
      |> filter(fn: (r) => r["topic"] == "powr2/data")
      |> group(columns: ["topic", "_field"])
      |> last()
      |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")
      |> keep(columns: ["topic", "active_power","temperature_setpoint", "reactive_power","apparent_power", "current", "energy", "relay_state","voltage","temperature", "rtc"])

  `;

  // Define the DeviceRow interface
  interface DeviceRow {
    topic: string;
    active_power?: number;
    apparent_power?: number;
    current?: number;
    energy?: number;
    reactive_power?: number;
    relay_state?: number;
    temperature?: number;
    voltage?: number;
    temperature_setpoint?: number;
    rtc?: string;
  }

  const devicesResult = await queryApi.collectRows<DeviceRow>(devicesQuery);
  console.log(devicesResult);
  const devices = devicesResult.map((row) => {
    const topicParts = row.topic.split("/");
    const deviceId = parseInt(topicParts[0].replace("powr", ""), 10);
    console.log(row);
    return {
      id: deviceId,
      name: `Device ${deviceId}`,
      temperature: row.temperature || 0,
      power: row.active_power || 0,
      temperature_setpoint: row.temperature_setpoint || 0,
      energy: row.energy || 0,
      relayState: row.relay_state === 1,
    };
  });

  // Fetch monthly energy consumption
  const monthlyEnergyQuery = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: -30d)
      |> filter(fn: (r) => r["_measurement"] == "mqtt_consumer")
      |> filter(fn: (r) => r["_field"] == "energy")
      |> aggregateWindow(every: 1mo, fn: last)
      |> yield(name: "last")
  `;

  // Define the DataRow interface for other queries
  interface DataRow {
    _time: string;
    _value: number;
  }

  const monthlyEnergyResult = await queryApi.collectRows<DataRow>(monthlyEnergyQuery);

  const monthlyEnergyConsumption = monthlyEnergyResult.map((row) => ({
    month: row._time,
    value: row._value,
  }));

  // Fetch monthly power consumption
  const monthlyPowerQuery = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: -30d)
      |> filter(fn: (r) => r["_measurement"] == "mqtt_consumer")
      |> filter(fn: (r) => r["_field"] == "active_power")
      |> aggregateWindow(every: 1mo, fn: mean)
      |> yield(name: "mean")
  `;

  const monthlyPowerResult = await queryApi.collectRows<DataRow>(monthlyPowerQuery);

  const monthlyPowerConsumption = monthlyPowerResult.map((row) => ({
    month: row._time,
    value: row._value,
  }));

  // Fetch monthly temperature
  const monthlyTemperatureQuery = `
    from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: -30d)
      |> filter(fn: (r) => r["_measurement"] == "mqtt_consumer")
      |> filter(fn: (r) => r["_field"] == "temperature")
      |> aggregateWindow(every: 1mo, fn: mean)
      |> yield(name: "mean")
  `;

  const monthlyTemperatureResult = await queryApi.collectRows<DataRow>(
    monthlyTemperatureQuery
  );

  const monthlyTemperature = monthlyTemperatureResult.map((row) => ({
    month: row._time,
    value: row._value,
  }));
  const data = {
    devices,
    monthlyEnergyConsumption,
    monthlyPowerConsumption,
    monthlyTemperature,
  };
  console.log(data);
  return data;
}

export default async function Home() {
  const data = await fetchData();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Dashboard data={data} />
      <h2>Temperature Setpoint</h2>
      <ClientSetpointForm action={handleSetpointSubmit} />
    </main>
  );
}
