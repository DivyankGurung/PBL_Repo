"use client";

import type { Ambulance } from "@/types";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

// Use a fixed reference time for mock data to prevent hydration issues
const MOCK_REFERENCE_TIME = new Date('2024-07-26T10:00:00.000Z').getTime();

const initialAmbulances: Ambulance[] = [
  { id: "AMB001", callSign: "Unit 101", status: "Available", currentLocation: "Station A, 12 Market St", crewMembers: ["EMT John Smith", "Paramedic Jane Doe"], lastSeen: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 2).toISOString() },
  { id: "AMB002", callSign: "Unit 203", status: "En route to scene", currentLocation: "Near 5th & Main", crewMembers: ["EMT Alice Brown", "Paramedic Bob Green"], lastSeen: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 1).toISOString() },
  { id: "AMB003", callSign: "Unit 305", status: "At scene", currentLocation: "123 Elm Street (EMR001)", crewMembers: ["EMT Charlie Black", "Paramedic Diana White"], lastSeen: new Date(MOCK_REFERENCE_TIME).toISOString() },
  { id: "AMB004", callSign: "Unit 102", status: "Transporting", currentLocation: "Highway 10, Mile 25", crewMembers: ["EMT Eve Davis", "Paramedic Frank Harris"], lastSeen: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 0.5).toISOString() },
  { id: "AMB005", callSign: "Unit 204", status: "Unavailable", currentLocation: "Station B, Maintenance", crewMembers: [], lastSeen: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 60).toISOString() },
];

export default function ActiveAmbulancesPage() {
  const [ambulances, setAmbulances] = useState<Ambulance[]>(initialAmbulances);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Active Ambulances</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Ambulance Fleet Status</CardTitle>
            <CardDescription>Overview of all active and available ambulances.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Call Sign</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ambulances.map((ambulance) => (
                  <TableRow key={ambulance.id}>
                    <TableCell className="font-medium">{ambulance.id}</TableCell>
                    <TableCell>{ambulance.callSign}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          ambulance.status === "Available" ? "default" :
                          ambulance.status === "Unavailable" ? "destructive" :
                          "secondary"
                        }
                        className={
                           ambulance.status === "Available" ? "bg-green-500 hover:bg-green-600 text-white" : ""
                        }
                      >
                        {ambulance.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ambulance.currentLocation}</TableCell>
                    <TableCell>
                      {isClient ? new Date(ambulance.lastSeen).toLocaleTimeString() : new Date(ambulance.lastSeen).toISOString().slice(11,19)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem>Track on Map</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
