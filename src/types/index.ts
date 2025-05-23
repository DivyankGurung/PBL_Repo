export interface EmergencyRequest {
  id: string;
  location: string;
  time: string; // ISO string or formatted date string
  type: "Cardiac Arrest" | "Accident" | "Fall" | "Breathing Difficulty" | "Other";
  status: "Pending" | "Dispatched" | "On-site" | "Transporting" | "Resolved" | "Cancelled";
  patientName?: string;
  notes?: string;
  ambulanceId?: string;
}

export interface Ambulance {
  id: string;
  callSign: string;
  status: "Available" | "En route to scene" | "At scene" | "En route to hospital" | "At hospital" | "Clearing" | "Unavailable";
  currentLocation: string; // For simplicity, using string. Could be {lat, lng}
  crewMembers: string[];
  lastSeen: string; // ISO string or formatted date string
}

export interface ActivityLog {
  id: string;
  timestamp: string; // ISO string or formatted date string
  description: string;
  category: "System" | "User Action" | "Emergency";
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "Admin" | "Dispatcher" | "Manager";
}
