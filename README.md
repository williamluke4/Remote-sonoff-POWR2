Please create a dashboard for a project that will manage 100s of smart devices that are logging the following data 

type Reading = {
  voltage: number
  current: number
  activePower: number
  apparentPower: number
  reactivePower: number
  energy: number
  temperature: number
  relayState: number
}

The data is stored in a influx v2 DB here is the query that produces the above result (NOTE: the host and topic will be different for each device)

 from(bucket: "${process.env.INFLUX_BUCKET}")
      |> range(start: -1h)
      |> filter(fn: (r) => r["_measurement"] == "mqtt_consumer")
      |> filter(fn: (r) => r["_field"] == "active_power" or r["_field"] == "apparent_power" or r["_field"] == "current" or r["_field"] == "energy" or r["_field"] == "reactive_power" or r["_field"] == "relay_state" or r["_field"] == "temperature" or r["_field"] == "voltage")
      |> filter(fn: (r) => r["host"] == "619d1b12ec7d")
      |> filter(fn: (r) => r["topic"] == "powr2/data")
      |> last()

I would like: 
- Total Connected Devices vs Disconnected Devices
- Average, min, max temperature of all devices
- Average realtime energy consumption of all devices
- Aaverage realtime power consumption of all devices
- A list of all devices with their current temperature, power consumption, and energy consumption and relay state
- Monthly energy consumption of all devices
- Monthly power consumption of all devices
- Monthly temperature (min,max, avg) of all devices
- Option to change the setpoint temperature which will turn off the devices if above said temperature.