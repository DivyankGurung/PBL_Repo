"use client";

import type { EmergencyRequest } from "@/types";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, MapPin, Clock, ListChecks, AlertTriangle, Ambulance as AmbulanceIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Use a fixed reference time for mock data to prevent hydration issues
const MOCK_REFERENCE_TIME = new Date('2024-07-26T10:00:00.000Z').getTime();

const initialRequests: EmergencyRequest[] = [
  { id: "EMR001", location: "123 Elm Street, Springfield", time: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 10).toISOString(), type: "Accident", status: "Pending", patientName: "John Doe", notes: "Possible head injury." },
  { id: "EMR002", location: "456 Oak Avenue, Shelbyville", time: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 25).toISOString(), type: "Cardiac Arrest", status: "Dispatched", ambulanceId: "AMB001" },
  { id: "EMR003", location: "789 Pine Lane, Capital City", time: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 45).toISOString(), type: "Fall", status: "On-site", ambulanceId: "AMB002", patientName: "Jane Smith" },
  { id: "EMR004", location: "101 Maple Drive, Ogdenville", time: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 70).toISOString(), type: "Breathing Difficulty", status: "Transporting", ambulanceId: "AMB003" },
  { id: "EMR005", location: "234 Birch Road, North Haverbrook", time: new Date(MOCK_REFERENCE_TIME - 1000 * 60 * 120).toISOString(), type: "Other", status: "Resolved", ambulanceId: "AMB001", notes: "Minor cut, treated on site." },
];

export default function EmergencyRequestsPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<EmergencyRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // State for dialog inputs
  const [dialogStatus, setDialogStatus] = useState<EmergencyRequest['status']>('Pending');
  const [dialogAmbulanceId, setDialogAmbulanceId] = useState<string>("");

  const handleViewDetails = (request: EmergencyRequest) => {
    setSelectedRequest(request);
    setDialogStatus(request.status);
    setDialogAmbulanceId(request.ambulanceId || "");
    setIsDetailModalOpen(true);
  };
  
  const simulateNewRequest = () => {
    const newIdNumber = requests.length + 1; // This might lead to duplicate IDs if requests are cancelled/removed. Better to use a UUID or a truly unique counter.
    const newId = `EMR${String(newIdNumber).padStart(3, '0')}`;
    const newRequest: EmergencyRequest = {
      id: newId,
      location: "Random Street, New City",
      time: new Date().toISOString(), // This uses actual current time, which is fine for a client-side action
      type: Math.random() > 0.5 ? "Accident" : "Cardiac Arrest",
      status: "Pending",
      patientName: "New Patient",
      notes: "This is a simulated request."
    };
    setRequests(prev => [newRequest, ...prev]);
    toast({
      title: "New Emergency Request!",
      description: `Request ${newId} received from ${newRequest.location}.`,
      variant: "default",
      action: (
        <Button variant="outline" size="sm" onClick={() => handleViewDetails(newRequest)}>
          View Details
        </Button>
      ),
    });
  };

  const handleSaveChangesInDialog = () => {
    if (!selectedRequest) return;

    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === selectedRequest.id
          ? { ...req, status: dialogStatus, ambulanceId: dialogAmbulanceId || undefined }
          : req
      )
    );
    setIsDetailModalOpen(false);
    toast({
      title: "Request Updated",
      description: `Request ${selectedRequest.id} has been updated.`,
    });
    setSelectedRequest(null);
  };

  const handleCancelRequest = (requestId: string) => {
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: "Cancelled", notes: req.notes ? `${req.notes} (Auto-cancelled)` : "Request cancelled by system." } : req
      )
    );
    toast({
      title: "Request Cancelled",
      description: `Request ${requestId} has been cancelled.`,
      variant: "destructive",
    });
  };

  const handleCloseDialog = () => {
    setIsDetailModalOpen(false);
    setSelectedRequest(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Emergency Requests</h1>
        <Button onClick={simulateNewRequest} variant="default">
          <PlusCircle className="mr-2 h-5 w-5" /> Simulate New Request
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Incoming & Active Requests</CardTitle>
          <CardDescription>Manage and track all emergency requests.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id} className={request.status === "Pending" ? "bg-accent/10 hover:bg-accent/20" : ""}>
                  <TableCell className="font-medium">{request.id}</TableCell>
                  <TableCell>{request.location}</TableCell>
                  <TableCell>
                    {isClient ? new Date(request.time).toLocaleTimeString() : new Date(request.time).toISOString().slice(11,19)}
                  </TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        request.status === "Pending" ? "destructive" :
                        request.status === "Dispatched" ? "default" :
                        request.status === "On-site" ? "secondary" :
                        request.status === "Transporting" ? "outline" : 
                        request.status === "Cancelled" ? "destructive" :
                        "default" // For resolved
                      }
                      className={
                        request.status === "Transporting" ? "border-primary text-primary" : ""
                      }
                    >
                      {request.status}
                    </Badge>
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
                        <DropdownMenuItem onClick={() => handleViewDetails(request)}>View Details</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(request)}>Assign Ambulance</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewDetails(request)}>Update Status</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleCancelRequest(request.id)}>Cancel Request</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedRequest && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-destructive" />
                Emergency Request Details: {selectedRequest.id}
              </DialogTitle>
              <DialogDescription>
                Detailed information about the emergency request.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
                <MapPin className="h-5 w-5 text-muted-foreground" /> <span className="font-medium">Location:</span> <span>{selectedRequest.location}</span>
                <Clock className="h-5 w-5 text-muted-foreground" /> <span className="font-medium">Time:</span> <span>{isClient ? new Date(selectedRequest.time).toLocaleString() : new Date(selectedRequest.time).toISOString().replace('T',' ').slice(0,16) + " UTC"}</span>
                <ListChecks className="h-5 w-5 text-muted-foreground" /> <span className="font-medium">Type:</span> <span>{selectedRequest.type}</span>
                <Badge className="h-5 w-5 text-muted-foreground" /> <span className="font-medium">Status:</span> <Badge variant={dialogStatus === "Pending" ? "destructive" : "default"}>{dialogStatus}</Badge>
                <ListChecks className="h-5 w-5 text-muted-foreground" /> <span className="font-medium">Patient:</span> <span>{selectedRequest.patientName || "N/A"}</span>
                <AmbulanceIcon className="h-5 w-5 text-muted-foreground" /> <span className="font-medium">Assigned Unit:</span> <span>{dialogAmbulanceId || "N/A"}</span>
              </div>
              {selectedRequest.notes && (
                <div className="space-y-1">
                  <Label className="font-medium">Notes:</Label>
                  <p className="text-sm text-muted-foreground p-2 border rounded-md bg-secondary/30">{selectedRequest.notes}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 pt-2">
                 <div>
                    <Label htmlFor="updateStatus">Update Status</Label>
                    <Select value={dialogStatus} onValueChange={(value) => setDialogStatus(value as EmergencyRequest['status'])}>
                      <SelectTrigger id="updateStatus">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Dispatched">Dispatched</SelectItem>
                        <SelectItem value="On-site">On-site</SelectItem>
                        <SelectItem value="Transporting">Transporting</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="assignAmbulance">Assign Ambulance</Label>
                    <Input id="assignAmbulance" value={dialogAmbulanceId} onChange={(e) => setDialogAmbulanceId(e.target.value)} placeholder="e.g. AMB004" />
                  </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCloseDialog}>Close</Button>
              <Button onClick={handleSaveChangesInDialog}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
