"use client";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  } from "recharts";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const barChartData = [
    { name: "January", uv: 4000, pv: 2400, amt: 2400 },
    { name: "February", uv: 3000, pv: 1398, amt: 2210 },
    { name: "March", uv: 2000, pv: 9800, amt: 2290 },
    { name: "April", uv: 2780, pv: 3908, amt: 2000 },
    { name: "May", uv: 1890, pv: 4800, amt: 2181 },
    { name: "June", uv: 2390, pv: 3800, amt: 2500 },
    { name: "July", uv: 3490, pv: 4300, amt: 2100 },
  ];
  
  const lineChartData = [
    { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
    { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
    { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
    { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
    { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  ];
  
  const pieChartData = [
    { name: "Group A", value: 400 },
    { name: "Group B", value: 300 },
    { name: "Group C", value: 300 },
    { name: "Group D", value: 200 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "#2563eb",
    },
    mobile: {
      label: "Mobile",
      color: "#60a5fa",
    },
  };
  

   function BarChartComponent() {

    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Bar Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" fill="#8884d8" />
              <Bar dataKey="uv" fill="#82ca9d" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }
  
  function LineChartComponent() {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Line Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}  className="w-full h-64">
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="pv" stroke="#8884d8" />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }
  
  function PieChartComponent() {
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>Pie Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}  className="w-full h-64">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    );
  }

  
  export default function Page() {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold opacity-80">Home</h1>
  
        {/* Grid Container */}
        <div className="grid grid-cols-[2fr_1fr] grid-rows-[2fr_1fr] gap-2.5">
          {/* Grid Items */}
          <div className="bg-card p-4 rounded-lg">
            <Suspense fallback={<Skeleton/>}>
            <BarChartComponent />
            </Suspense>
          </div>
          <div className="bg-card p-4 rounded-lg">Grid Item 2</div>
          <div className="bg-card p-4 rounded-lg">
             <Suspense fallback={<Skeleton/>}>
            <LineChartComponent />
            </Suspense>
          </div>
          <div className="bg-card p-4 rounded-lg">
          <Suspense fallback={<Skeleton/>}>

            <PieChartComponent />
            </Suspense>
          </div>
        </div>
      </div>
    );
  }
  