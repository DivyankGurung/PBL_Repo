"use client"; // Already a client component due to chart

import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Siren, Ambulance as AmbulanceIcon, Clock, Users } from "lucide-react";
import type { EmergencyRequest, ActivityLog } from "@/types";
import { DashboardBarChart } from "@/components/dashboard/dashboard-bar-chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useState, useEffect } from "react";

// Use a fixed reference time for mock data to prevent hydration issues
const MOCK_REFERENCE_TIME = new Date('2024-07-26T10:00:00.000Z').getTime();

const recentRequestsData: EmergencyRequest[] = [
  { id: "REQ001", location: "123 Main St, Cityville", time: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 5).toISOString(), type: "Accident", status: "Pending" },
  { id: "REQ002", location: "456 Oak Ave, Townsfolk", time: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 15).toISOString(), type: "Cardiac Arrest", status: "Dispatched", ambulanceId: "AMB003" },
  { id: "REQ003", location: "789 Pine Ln, Villagetown", time: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 30).toISOString(), type: "Fall", status: "On-site", ambulanceId: "AMB001" },
];

const activityLogData: ActivityLog[] = [
  { id: "LOG001", timestamp: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 2).toISOString(), description: "New emergency request REQ001 received.", category: "Emergency" },
  { id: "LOG002", timestamp: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 3).toISOString(), description: "Ambulance AMB003 dispatched to REQ002.", category: "System" },
  { id: "LOG003", timestamp: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 10).toISOString(), description: "User 'Admin' logged in.", category: "User Action" },
  { id: "LOG004", timestamp: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 25).toISOString(), description: "Ambulance AMB001 arrived at REQ003 scene.", category: "System" },
];

const chartData = [
  { month: "Jan", requests: 186, resolved: 80 },
  { month: "Feb", requests: 305, resolved: 200 },
  { month: "Mar", requests: 237, resolved: 120 },
  { month: "Apr", requests: 273, resolved: 190 },
  { month: "May", requests: 209, resolved: 130 },
  { month: "Jun", requests: 214, resolved: 140 },
];

const chartConfig: ChartConfig = {
  requests: { label: "Total Requests", color: "hsl(var(--primary))" },
  resolved: { label: "Resolved", color: "hsl(var(--accent))" },
};


export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Emergency Requests" value="1,234" icon={Siren} description="Last 30 days" trend="+5.2% from last month" trendDirection="up"/>
        <StatCard title="Active Ambulances" value="8" icon={AmbulanceIcon} description="Currently on duty" />
        <StatCard title="Average Response Time" value="7m 32s" icon={Clock} description="Last 24 hours" trend="-0.5% from yesterday" trendDirection="up"/>
        <StatCard title="Resolved Incidents" value="982" icon={Users} description="Last 30 days" trend="+3.1% from last month" trendDirection="up"/>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Emergency Requests Overview</CardTitle>
            <CardDescription>Monthly requests and resolutions.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardBarChart chartData={chartData} chartConfig={chartConfig} />
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system and emergency events.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {activityLogData.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3">
                    <Activity className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{log.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {isClient ? new Date(log.timestamp).toLocaleTimeString() : new Date(log.timestamp).toISOString().slice(11,19)} - {isClient ? new Date(log.timestamp).toLocaleDateString() : new Date(log.timestamp).toISOString().slice(0,10)}
                      </p>
                    </div>
                     <Badge variant={log.category === 'Emergency' ? 'destructive' : 'secondary'} className="ml-auto whitespace-nowrap">{log.category}</Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Ongoing Emergency Requests</CardTitle>
          <CardDescription>A quick view of current high-priority requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Unit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequestsData.filter(req => req.status !== "Resolved" && req.status !== "Cancelled").slice(0,3).map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.location}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    <Badge variant={request.status === "Pending" ? "destructive" : "outline"}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{request.ambulanceId || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
