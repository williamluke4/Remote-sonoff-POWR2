/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    INFLUX_HOST: process.env.INFLUX_HOST,
    INFLUX_TOKEN: process.env.INFLUX_TOKEN,
    INFLUX_ORG: process.env.INFLUX_ORG,
    INFLUX_BUCKET: process.env.INFLUX_BUCKET,
    MQTT_BROKER_HOST: process.env.MQTT_BROKER_HOST,
    MQTT_BROKER_PORT: process.env.MQTT_BROKER_PORT,
  },
};
export default nextConfig;
