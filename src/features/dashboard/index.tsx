import { useEffect, useState } from "react";
import { getCurrentUser } from "@/guards/useAuthGuard";
import {
  Activity,
  Users,
  MessageSquare,
  Megaphone,
  FolderOpen,
  Calendar,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import { useFirebaseStats } from "@/hooks/useFirebaseStats";
import {
  useRecentActivity,
  useRecentAnnouncements,
  useRecentMessages,
  useUpcomingEvents,
} from "@/hooks/useDashboardData";
import { Spinner } from "@/components/ui/spinner";
import { SkeletonCard, SkeletonList } from "@/components/ui/loading-skeletons";

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
        <div className="flex items-center mt-1 text-xs text-emerald-600 dark:text-emerald-400">
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
        return Activity;
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
  const stats = useFirebaseStats();

  // Real-time data hooks
  const { activity, loading: activityLoading } = useRecentActivity(5);
  const { announcements, loading: announcementsLoading } = useRecentAnnouncements(5);
  const { messages, loading: messagesLoading } = useRecentMessages(user?.uuid || "", 5);
  const { events, loading: eventsLoading } = useUpcomingEvents(3);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user || stats.loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
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
            value={stats.totalUsers || 0}
            icon={Users}
            description="Registered users"
          />
          <StatCard
            title="Conversations"
            value={stats.totalConversations || 0}
            icon={MessageSquare}
            description="Total messages"
          />
          <StatCard
            title="Announcements"
            value={stats.totalAnnouncements}
            icon={Megaphone}
            description="Total announcements"
          />
          <StatCard
            title="Upcoming Events"
            value={stats.totalEvents}
            icon={Calendar}
            description="Next 7 days"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Events */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {eventsLoading ? (
                <SkeletonList items={5} showAvatar />
              ) : events.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming events
                </div>
              ) : (
                <>
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-start space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => router.navigate({ to: "/dashboard/calendar" })}
                    >
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{event.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(event.startTime).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          📍 {event.location}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    className="w-full mt-4"
                    onClick={() => router.navigate({ to: "/dashboard/calendar" })}
                  >
                    View Calendar
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Recent Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcementsLoading ? (
                <SkeletonList items={5} showAvatar={false} showBadge />
              ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No announcements yet
                </div>
              ) : (
                announcements.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => router.navigate({ to: "/dashboard/announcements" })}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{item.title}</p>
                        <Badge
                          variant={item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
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
                onClick={() => router.navigate({ to: "/dashboard/user-management" })}
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
            value={stats.totalUsers || 0}
            icon={Users}
            description="Registered users"
          />
          <StatCard
            title="Announcements"
            value={stats.totalAnnouncements || 0}
            icon={Megaphone}
            description="Total announcements"
          />
          <StatCard
            title="Resources"
            value={stats.totalResources || 0}
            icon={FolderOpen}
            description="Shared resources"
          />
          <StatCard
            title="Events"
            value={stats.totalEvents || 0}
            icon={Clock}
            description="Calendar events"
          />
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {activityLoading ? (
                <SkeletonList items={5} showAvatar showBadge />
              ) : activity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No recent activity
                </div>
              ) : (
                <>
                  {activity.map((item) => (
                    <ActivityItem key={item.id} activity={item} />
                  ))}
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Announcements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Recent Announcements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {announcementsLoading ? (
                <SkeletonList items={5} showAvatar={false} showBadge />
              ) : announcements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No announcements yet
                </div>
              ) : (
                announcements.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => router.navigate({ to: "/dashboard/announcements" })}
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{item.title}</p>
                        <Badge
                          variant={item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
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
                onClick={() => router.navigate({ to: "/dashboard/user-management" })}
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
          title="My Conversations"
          value={messages.length}
          icon={MessageSquare}
          description="Total conversations"
        />
        <StatCard
          title="Announcements"
          value={stats.totalAnnouncements || 0}
          icon={Megaphone}
          description="Total announcements"
        />
        <StatCard
          title="Resources"
          value={stats.totalResources || 0}
          icon={FolderOpen}
          description="Shared resources"
        />
        <StatCard
          title="Upcoming Events"
          value={events.length}
          icon={Calendar}
          description="Your events"
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
            {messagesLoading ? (
              <SkeletonList items={5} showAvatar={false} />
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent messages
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => router.navigate({ to: `/dashboard/messages/${msg.id}` })}
                  >
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{msg.subject}</p>
                      <p className="text-xs text-muted-foreground">
                        {msg.participants.length} participants
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(msg.updatedAt || msg.createdAt).toLocaleString()}
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
              </>
            )}
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
            {eventsLoading ? (
              <SkeletonList items={3} showAvatar />
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming events
              </div>
            ) : (
              <>
                {events.map((event) => (
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
                        {new Date(event.startTime).toLocaleString()}
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
              </>
            )}
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
