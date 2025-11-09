import { useEffect, useState } from "react";
import { getCurrentUser } from "@/guards/useAuthGuard";
import {
  Activity,
  Users,
  MessageSquare,
  Megaphone,
  FolderOpen,
  Calendar,
  AlertCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  Server,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import dashboardData from "@/data/dashboard.json";

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: {
  title: string;
  value: string | number;
  icon: any;
  description?: string;
  trend?: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
      {trend && (
        <div className="flex items-center mt-1 text-xs text-green-600">
          <TrendingUp className="h-3 w-3 mr-1" />
          {trend}
        </div>
      )}
    </CardContent>
  </Card>
);

// Activity Item Component
const ActivityItem = ({ activity }: { activity: any }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive";
      case "high":
        return "default";
      default:
        return "secondary";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "message":
        return MessageSquare;
      case "announcement":
        return Megaphone;
      case "user":
        return Users;
      case "system":
        return Server;
      default:
        return Activity;
    }
  };

  const Icon = getTypeIcon(activity.type);

  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="bg-primary/10 p-2 rounded-full">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">{activity.title}</p>
          {activity.priority && (
            <Badge
              variant={getPriorityColor(activity.priority)}
              className="text-xs"
            >
              {activity.priority}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{activity.description}</p>
        <p className="text-xs text-muted-foreground">
          {new Date(activity.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dashData, setDashData] = useState<any>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser) {
      // Get role-specific dashboard data
      setDashData(
        dashboardData[currentUser.role as keyof typeof dashboardData]
      );
    }
  }, []);

  if (!user || !dashData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Adjt Dashboard
  if (user.role === "adjt") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, {user.rank} {user.name}
            </h1>
            <p className="text-muted-foreground">
              Command Overview • {user.unit}
            </p>
          </div>
          <Badge variant="default" className="text-sm">
            Adjutant
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={dashData.stats.totalUsers}
            icon={Users}
            description={`${dashData.stats.activeUsers} active`}
            trend="+12 this month"
          />
          <StatCard
            title="Pending Messages"
            value={dashData.stats.pendingMessages}
            icon={MessageSquare}
            description="Requires attention"
          />
          <StatCard
            title="Announcements"
            value={dashData.stats.totalAnnouncements}
            icon={Megaphone}
            description={`${dashData.stats.unreadAnnouncements} unread`}
          />
          <StatCard
            title="Upcoming Events"
            value={dashData.stats.upcomingEvents}
            icon={Calendar}
            description="Next 7 days"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dashData.recentActivity.map((activity: any) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => router.navigate({ to: "/dashboard/messages" })}
              >
                View All Activity
              </Button>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Pending Approvals
                <Badge variant="destructive" className="ml-auto">
                  {dashData.pendingApprovals.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dashData.pendingApprovals.map((item: any) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-3 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      By {item.requestedBy}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default">
                      <CheckCircle className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() =>
                  router.navigate({ to: "/dashboard/announcements" })
                }
              >
                <Megaphone className="h-6 w-6 mb-2" />
                New Announcement
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => router.navigate({ to: "/dashboard/messages" })}
              >
                <MessageSquare className="h-6 w-6 mb-2" />
                Send Message
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => router.navigate({ to: "/dashboard/users" })}
              >
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => router.navigate({ to: "/dashboard/analytics" })}
              >
                <Activity className="h-6 w-6 mb-2" />
                View Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // IT JCO Dashboard
  if (user.role === "it_jco") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome, {user.rank} {user.name}
            </h1>
            <p className="text-muted-foreground">
              System Administration • {user.unit}
            </p>
          </div>
          <Badge variant="default" className="text-sm">
            IT JCO
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={dashData.stats.totalUsers}
            icon={Users}
            description={`${dashData.stats.activeUsers} active`}
          />
          <StatCard
            title="System Health"
            value={dashData.stats.systemHealth.toUpperCase()}
            icon={Server}
            description="All systems operational"
          />
          <StatCard
            title="Storage Used"
            value={dashData.systemStatus.storage}
            icon={FolderOpen}
            description="Database storage"
          />
          <StatCard
            title="Pending Tasks"
            value={dashData.stats.pendingMessages}
            icon={Clock}
            description="Requires attention"
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(dashData.systemStatus).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <Badge
                    variant={
                      value === "operational" || key === "storage"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {key === "lastBackup"
                      ? new Date(value as string).toLocaleString()
                      : (value as string)}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {dashData.recentActivity.map((activity: any) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => router.navigate({ to: "/dashboard/users" })}
              >
                <Users className="h-6 w-6 mb-2" />
                Manage Users
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => router.navigate({ to: "/dashboard/messages" })}
              >
                <MessageSquare className="h-6 w-6 mb-2" />
                Messages
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => router.navigate({ to: "/dashboard/resources" })}
              >
                <FolderOpen className="h-6 w-6 mb-2" />
                Resources
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => router.navigate({ to: "/dashboard/analytics" })}
              >
                <Activity className="h-6 w-6 mb-2" />
                Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Regular User Dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {user.rank} {user.name}
          </h1>
          <p className="text-muted-foreground">
            Personal Dashboard • {user.unit}
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Personnel
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Unread Messages"
          value={dashData.stats.unreadMessages}
          icon={MessageSquare}
          description="New messages"
        />
        <StatCard
          title="Announcements"
          value={dashData.stats.unreadAnnouncements}
          icon={Megaphone}
          description="Unread announcements"
        />
        <StatCard
          title="Shared Resources"
          value={dashData.stats.sharedResources}
          icon={FolderOpen}
          description="Available to you"
        />
        <StatCard
          title="Upcoming Events"
          value={dashData.stats.upcomingEvents}
          icon={Calendar}
          description="Next 7 days"
        />
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashData.recentMessages.map((msg: any) => (
              <div
                key={msg.id}
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{msg.from}</p>
                    {!msg.isRead && (
                      <Badge variant="default" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium">{msg.subject}</p>
                  <p className="text-xs text-muted-foreground">{msg.preview}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.navigate({ to: "/dashboard/messages" })}
            >
              View All Messages
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dashData.upcomingEvents.map((event: any) => (
              <div
                key={event.id}
                className="flex items-start space-x-3 p-3 rounded-lg border"
              >
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(event.date).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    📍 {event.location}
                  </p>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.navigate({ to: "/dashboard/calendar" })}
            >
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.navigate({ to: "/dashboard/messages" })}
            >
              <MessageSquare className="h-6 w-6 mb-2" />
              Messages
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() =>
                router.navigate({ to: "/dashboard/announcements" })
              }
            >
              <Megaphone className="h-6 w-6 mb-2" />
              Announcements
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.navigate({ to: "/dashboard/resources" })}
            >
              <FolderOpen className="h-6 w-6 mb-2" />
              Resources
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => router.navigate({ to: "/dashboard/calendar" })}
            >
              <Calendar className="h-6 w-6 mb-2" />
              Calendar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
