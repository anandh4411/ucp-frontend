import { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Bell, Save } from "lucide-react";
import { toast } from "sonner";
import { updateUser } from "@/api/firebase/firestore";
import { updatePassword } from "@/api/firebase/auth";
import { Spinner } from "@/components/ui/spinner";

interface NotificationSettings {
  announcements: boolean;
  messages: boolean;
  events: boolean;
  email: boolean;
}

export default function SettingsPage() {
  const { userProfile } = useAuth();
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    rank: "",
    unit: "",
    phone: "",
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Notification settings state
  const [notifications, setNotifications] = useState<NotificationSettings>({
    announcements: true,
    messages: true,
    events: true,
    email: true,
  });

  // Load user profile data
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        name: userProfile.name || "",
        email: userProfile.email || "",
        rank: userProfile.rank || "",
        unit: userProfile.unit || "",
        phone: userProfile.phone || "",
      });

      // Load notification settings from userProfile first, then fallback to localStorage
      const userPreferences = (userProfile as any).preferences;
      if (userPreferences) {
        setNotifications(userPreferences);
      } else {
        const savedSettings = localStorage.getItem(`notifications_${userProfile.uuid}`);
        if (savedSettings) {
          setNotifications(JSON.parse(savedSettings));
        }
      }
    }
  }, [userProfile]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.uuid) return;

    setSaving(true);
    try {
      await updateUser(userProfile.uuid, {
        name: profileForm.name,
        rank: profileForm.rank,
        unit: profileForm.unit,
        phone: profileForm.phone,
      });

      toast.success("Profile updated successfully. Changes will reflect on next login.");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setSaving(true);
    try {
      await updatePassword(passwordForm.newPassword);
      toast.success("Password updated successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  // Handle notification settings update
  const handleNotificationUpdate = async () => {
    if (!userProfile?.uuid) return;

    setSaving(true);
    try {
      // Save to Firebase
      await updateUser(userProfile.uuid, {
        preferences: notifications,
      } as any);

      // Also save to localStorage as backup
      localStorage.setItem(
        `notifications_${userProfile.uuid}`,
        JSON.stringify(notifications)
      );

      toast.success("Notification preferences saved successfully");
    } catch (error: any) {
      console.error("Notification update error:", error);
      toast.error(error.message || "Failed to update notification settings");
    } finally {
      setSaving(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Read-only)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rank">Rank *</Label>
                    <Input
                      id="rank"
                      value={profileForm.rank}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, rank: e.target.value })
                      }
                      placeholder="e.g., Maj, Lt Col"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <Input
                      id="unit"
                      value={profileForm.unit}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, unit: e.target.value })
                      }
                      placeholder="e.g., 2nd Battalion"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({ ...profileForm, phone: e.target.value })
                      }
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving} isLoading={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password *</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    placeholder="Enter new password (min 6 characters)"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Re-enter new password"
                    required
                  />
                </div>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground">
                    Password requirements:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside mt-1">
                    <li>Minimum 6 characters</li>
                    <li>Mix of letters and numbers recommended</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saving} isLoading={saving}>
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="announcements">Announcements</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new announcements
                    </p>
                  </div>
                  <Switch
                    id="announcements"
                    checked={notifications.announcements}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, announcements: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="messages">Messages</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new messages
                    </p>
                  </div>
                  <Switch
                    id="messages"
                    checked={notifications.messages}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, messages: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="events">Calendar Events</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about upcoming events
                    </p>
                  </div>
                  <Switch
                    id="events"
                    checked={notifications.events}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, events: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications (coming soon)
                    </p>
                  </div>
                  <Switch
                    id="email"
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                    disabled
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleNotificationUpdate}
                  disabled={saving}
                  isLoading={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
