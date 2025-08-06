"use client";

import { SignIn } from "@/components/auth/sigin-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "@/components/UserAvatar";
import {
  Battery,
  PlusCircle,
  Thermometer,
  ToggleLeft,
  Trash2,
  Zap,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Enhanced Chart component with gradient
const Chart = ({
  data,
  dataKey,
  stroke = "hsl(var(--primary))",
  gradient = ["hsl(var(--primary))", "hsl(var(--background))"],
}) => (
  <ResponsiveContainer width="100%" height={300}>
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <defs>
        <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={gradient[0]} stopOpacity={0.8} />
          <stop offset="95%" stopColor={gradient[1]} stopOpacity={0.1} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey={dataKey}
        stroke={stroke}
        fillOpacity={1}
        fill={`url(#color${dataKey})`}
      />
    </AreaChart>
  </ResponsiveContainer>
);

export default function Dashboard({ data }) {
  const [setpointTemperature, setSetpointTemperature] = useState(30);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [isAddDeviceDialogOpen, setIsAddDeviceDialogOpen] = useState(false);

  const handleSetpointChange = (value: number[]) => {
    setSetpointTemperature(value[0]);
  };

  const addDevice = () => {
    if (newDeviceName) {
      const newDevice = {
        id: data.devices.length + 1,
        name: newDeviceName,
        temperature: Math.floor(Math.random() * 10) + 20,
        power: Math.floor(Math.random() * 100) + 50,
        energy: Math.floor(Math.random() * 500) + 200,
        relayState: Math.random() > 0.5,
      };
      console.log("add", newDevice);
      setNewDeviceName("");
      setIsAddDeviceDialogOpen(false);
    }
  };

  const removeDevice = (id: number) => {
    console.log("remove");
  };

  const toggleDeviceState = (id: number) => {
    console.log("toggle");
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  const {
    devices,
    monthlyEnergyConsumption,
    monthlyPowerConsumption,
    monthlyTemperature,
  } = data;

  // Calculate additional statistics
  const totalDevices = devices.length;
  const connectedDevices = devices.filter((device) => device.relayState).length;
  const disconnectedDevices = totalDevices - connectedDevices;
  const totalEnergyConsumption = devices.reduce(
    (sum, device) => sum + device.energy,
    0
  );
  const totalPowerConsumption = devices.reduce(
    (sum, device) => sum + device.power,
    0
  );
  const averageDeviceTemperature =
    devices.reduce((sum, device) => sum + device.temperature, 0) /
    devices.length;
  const activeDevices = devices.filter((device) => device.relayState).length;

  const energyDistribution = [
    { name: "Active", value: activeDevices },
    { name: "Inactive", value: devices.length - activeDevices },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <SignIn/>
      <h1 className="text-4xl font-bold mb-6 text-center text-primary">
        Power Pulse
      </h1>
      <UserAvatar />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devices</CardTitle>
            <ToggleLeft className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDevices}</div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                Connected: {connectedDevices}
              </span>
              <span className="text-xs text-muted-foreground flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                Disconnected: {disconnectedDevices}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageDeviceTemperature.toFixed(1)}°C
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">
                Min: {Math.min(...devices.map((device) => device.temperature))}
                °C
              </span>
              <span className="text-xs text-muted-foreground">
                Max: {Math.max(...devices.map((device) => device.temperature))}
                °C
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Energy Consumption
            </CardTitle>
            <Battery className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalEnergyConsumption} kWh
            </div>
            <p className="text-xs text-muted-foreground">Total consumption</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Power Consumption
            </CardTitle>
            <Zap className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPowerConsumption} W</div>
            <p className="text-xs text-muted-foreground">Total consumption</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="energy">Energy & Power</TabsTrigger>
          <TabsTrigger value="temperature">Temperature</TabsTrigger>
        </TabsList>
        <TabsContent value="devices">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Device List</CardTitle>
              <Dialog
                open={isAddDeviceDialogOpen}
                onOpenChange={setIsAddDeviceDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Device
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Device</DialogTitle>
                    <DialogDescription>
                      Enter the name of the new device you want to add to the
                      system.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={newDeviceName}
                        onChange={(e) => setNewDeviceName(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit" onClick={addDevice}>
                      Add Device
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device Name</TableHead>
                    <TableHead>Temperature</TableHead>
                    <TableHead>Setpoint</TableHead>
                    <TableHead>Power Consumption</TableHead>
                    <TableHead>Energy Consumption</TableHead>
                    <TableHead>Relay State</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{device.temperature}°C</TableCell>
                      <TableCell>{device.temperature_setpoint}°C</TableCell>
                      <TableCell>{device.power} W</TableCell>
                      <TableCell>{device.energy} kWh</TableCell>
                      <TableCell>
                        <Switch
                          checked={device.relayState}
                          onCheckedChange={() => toggleDeviceState(device.id)}
                          aria-label={`Toggle ${device.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDevice(device.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="energy">
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Energy Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={monthlyEnergyConsumption}
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  gradient={["hsl(var(--primary))", "hsl(var(--background))"]}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Monthly Power Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <Chart
                  data={monthlyPowerConsumption}
                  dataKey="value"
                  stroke="hsl(var(--secondary))"
                  gradient={["hsl(var(--secondary))", "hsl(var(--background))"]}
                />
              </CardContent>
            </Card>
          </div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Device Energy Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={energyDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {energyDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="temperature">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Temperature</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTemperature}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="min"
                    stroke="hsl(var(--primary))"
                  />
                  <Line
                    type="monotone"
                    dataKey="max"
                    stroke="hsl(var(--secondary))"
                  />
                  <Line
                    type="monotone"
                    dataKey="avg"
                    stroke="hsl(var(--accent))"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Temperature Setpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Slider
                  value={[setpointTemperature]}
                  onValueChange={handleSetpointChange}
                  max={40}
                  min={10}
                  step={1}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {setpointTemperature}°C
                  </span>
                  <Button>Apply Setpoint</Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Devices will turn off if temperature exceeds the setpoint.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
