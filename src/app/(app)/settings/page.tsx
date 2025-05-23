import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Users, Bell, Shield, MapPin, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const handleSaveChanges = (section: string) => {
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated. (Simulated)`,
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">System Settings</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-6 w-6 text-primary" /> User Management</CardTitle>
          <CardDescription>Configure user roles, permissions, and manage accounts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="newUserEmail">Invite New User</Label>
            <div className="flex gap-2">
              <Input id="newUserEmail" type="email" placeholder="user@example.com" />
              <Select defaultValue="dispatcher">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="dispatcher">Dispatcher</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleSaveChanges('User Invitation')}>Invite</Button>
            </div>
          </div>
          <Separator />
          <div>
            <h3 className="text-lg font-medium mb-2">Existing Users</h3>
            <p className="text-sm text-muted-foreground">User list and role management will be displayed here.</p>
            {/* Placeholder for user table */}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => handleSaveChanges('User Management')}>Save User Settings</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Bell className="mr-2 h-6 w-6 text-primary" /> Alert Thresholds & Notifications</CardTitle>
          <CardDescription>Set up alert parameters and notification preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="responseTimeAlert">Max Response Time Alert (minutes)</Label>
              <Input id="responseTimeAlert" type="number" defaultValue="15" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lowAvailabilityAlert">Low Ambulance Availability Threshold</Label>
              <Input id="lowAvailabilityAlert" type="number" defaultValue="2" />
            </div>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="emailNotifications" defaultChecked />
            <Label htmlFor="emailNotifications">Enable Email Notifications for Critical Alerts</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="smsNotifications" />
            <Label htmlFor="smsNotifications">Enable SMS Notifications for Critical Alerts</Label>
          </div>
           <div className="flex justify-end">
            <Button onClick={() => handleSaveChanges('Alert & Notification')}>Save Alert Settings</Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><MapPin className="mr-2 h-6 w-6 text-primary" /> Geofencing & Location</CardTitle>
          <CardDescription>Manage operational zones and location-based settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="space-y-2">
            <Label htmlFor="primaryZone">Primary Operational Zone (e.g., City Center)</Label>
            <Input id="primaryZone" placeholder="Define primary zone boundaries or name" />
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Switch id="autoAssignZone" defaultChecked />
            <Label htmlFor="autoAssignZone">Auto-assign requests based on zone proximity</Label>
          </div>
          <div className="flex justify-end">
             <Button onClick={() => handleSaveChanges('Geofencing')}>Save Location Settings</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center"><Shield className="mr-2 h-6 w-6 text-primary" /> Security & System</CardTitle>
          <CardDescription>Manage security settings and system parameters.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="twoFactorAuth" className="flex-grow">Enable Two-Factor Authentication (2FA)</Label>
            <Switch id="twoFactorAuth" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
            <Input id="sessionTimeout" type="number" defaultValue="30" />
          </div>
          <div className="flex flex-col space-y-2">
            <Button variant="outline">View Audit Logs</Button>
            <Button variant="destructive" className="w-fit">Force Logout All Users <LogOut className="ml-2 h-4 w-4"/></Button>
          </div>
           <div className="flex justify-end">
             <Button onClick={() => handleSaveChanges('Security & System')}>Save Security Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
