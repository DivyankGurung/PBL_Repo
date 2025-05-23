"use client";

import type { EmergencyRequest, ActivityLog } from "@/types";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter, CalendarDays, Download, Search } from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker"; 

// Use a fixed reference time for mock data to prevent hydration issues
const MOCK_REFERENCE_TIME = new Date('2024-07-26T10:00:00.000Z').getTime();

const pastRequests: EmergencyRequest[] = [
  { id: "HST001", location: "99 Old Mill Rd", time: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 60 * 24 * 2).toISOString(), type: "Accident", status: "Resolved", ambulanceId: "AMB001", notes: "Patient transported to City General." },
  { id: "HST002", location: "50 Downtown Ave", time: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 60 * 24 * 3).toISOString(), type: "Cardiac Arrest", status: "Resolved", ambulanceId: "AMB002", notes: "CPR administered, vital signs stable upon arrival." },
  { id: "HST003", location: "15 Suburbia Ct", time: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 60 * 24 * 5).toISOString(), type: "Fall", status: "Cancelled", notes: "Caller reported false alarm." },
  { id: "HST004", location: "Industrial Park Unit 7", time: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 60 * 24 * 7).toISOString(), type: "Breathing Difficulty", status: "Resolved", ambulanceId: "AMB003", notes: "Oxygen provided, patient advised to see GP." },
];

const systemLogs: ActivityLog[] = [
  { id: "SL001", timestamp: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 60 * 5).toISOString(), description: "System update v2.1 applied.", category: "System" },
  { id: "SL002", timestamp: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 60 * 24).toISOString(), description: "User 'Dispatcher01' updated request HST002.", category: "User Action" },
  { id: "SL003", timestamp: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 60 * 48).toISOString(), description: "Backup completed successfully.", category: "System" },
];

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simplified filter logic
  const filteredRequests = pastRequests.filter(req => 
    req.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    req.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (req.ambulanceId && req.ambulanceId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredLogs = systemLogs.filter(log =>
    log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.category.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">History & Logs</h1>
      
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <CardTitle>Data Archives</CardTitle>
              <CardDescription>Access historical emergency data and system activity logs.</CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export Data</Button>
            </div>
          </div>
           <div className="mt-4 flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search by ID, location, unit, or log description..." 
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DateRangePicker className="w-full md:w-auto" /> 
            <Select>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="cardiac">Cardiac Arrest</SelectItem>
                <SelectItem value="fall">Fall</SelectItem>
                <SelectItem value="breathing">Breathing Difficulty</SelectItem>
                <SelectItem value="system">System Log</SelectItem>
                <SelectItem value="user_action">User Action</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="requests">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="requests">Emergency Requests</TabsTrigger>
              <TabsTrigger value="logs">Activity Logs</TabsTrigger>
            </TabsList>
            <TabsContent value="requests" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>{request.location}</TableCell>
                      <TableCell>
                        {isClient ? new Date(request.time).toLocaleString() : new Date(request.time).toISOString().replace('T',' ').slice(0,16) + " UTC"}
                      </TableCell>
                      <TableCell>{request.type}</TableCell>
                      <TableCell>
                        <Badge variant={request.status === "Resolved" ? "default" : "destructive"}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.ambulanceId || "N/A"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="logs" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                         {isClient ? new Date(log.timestamp).toLocaleString() : new Date(log.timestamp).toISOString().replace('T',' ').slice(0,16) + " UTC"}
                      </TableCell>
                      <TableCell>{log.description}</TableCell>
                      <TableCell>
                        <Badge variant={log.category === "System" ? "secondary" : "outline"}>
                          {log.category}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
