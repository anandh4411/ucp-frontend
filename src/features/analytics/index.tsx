import { useState } from "react";
import {
  Users,
  MessageSquare,
  Megaphone,
  FolderOpen,
  Download,
  Eye,
  BarChart3,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirebaseStats } from "@/hooks/useFirebaseStats";
import {
  useUserEngagement,
  useAnnouncementAnalytics,
  useResourceAnalytics,
  useMessageAnalytics,
} from "@/hooks/useAnalytics";

// Stat Card Component
const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendUp = true,
}: {
  title: string;
  value: string | number;
  icon: any;
  description?: string;
  trend?: string;
  trendUp?: boolean;
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
        <div
          className={`flex items-center mt-1 text-xs ${
            trendUp ? "text-green-600" : "text-red-600"
          }`}
        >
          <span>{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

// Simple Bar Chart Component
const SimpleBarChart = ({ data, dataKey, valueKey }: any) => {
  const maxValue = Math.max(...data.map((item: any) => item[valueKey]));

  return (
    <div className="space-y-3">
      {data.map((item: any, index: number) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{item[dataKey]}</span>
            <span className="text-muted-foreground">{item[valueKey]}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all"
              style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Pie Chart Component
const SimplePieChart = ({ data, dataKey, valueKey }: any) => {
  const total = data.reduce((sum: number, item: any) => sum + item[valueKey], 0);
  const colors = [
    "bg-primary",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
  ];

  return (
    <div className="space-y-3">
      {data.map((item: any, index: number) => {
        const percentage = total > 0 ? ((item[valueKey] / total) * 100).toFixed(1) : "0.0";
        return (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1">
              <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
              <span className="text-sm">{item[dataKey]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{item[valueKey]}</span>
              <Badge variant="secondary">{percentage}%</Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Format bytes to human readable
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const stats = useFirebaseStats();
  const userEngagement = useUserEngagement();
  const announcementAnalytics = useAnnouncementAnalytics();
  const resourceAnalytics = useResourceAnalytics();
  const messageAnalytics = useMessageAnalytics();

  const isLoading =
    stats.loading ||
    userEngagement.loading ||
    announcementAnalytics.loading ||
    resourceAnalytics.loading ||
    messageAnalytics.loading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Loading analytics data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const hasError =
    userEngagement.error ||
    announcementAnalytics.error ||
    resourceAnalytics.error ||
    messageAnalytics.error;

  if (hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-destructive">Error loading analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive insights into unit communication and activity
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
              description="Registered personnel"
            />
            <StatCard
              title="Active Users (7d)"
              value={userEngagement.activeUsers7Days}
              icon={Users}
              description="Users active in last 7 days"
            />
            <StatCard
              title="Total Conversations"
              value={messageAnalytics.totalConversations}
              icon={MessageSquare}
              description="All message threads"
            />
            <StatCard
              title="Total Announcements"
              value={stats.totalAnnouncements}
              icon={Megaphone}
              description="Official announcements"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Resources"
              value={stats.totalResources}
              icon={FolderOpen}
              description="Shared documents & files"
            />
            <StatCard
              title="Total Events"
              value={stats.totalEvents}
              icon={Calendar}
              description="Calendar events"
            />
            <StatCard
              title="Active Users (30d)"
              value={userEngagement.activeUsers30Days}
              icon={Users}
              description="Users active in last 30 days"
            />
            <StatCard
              title="Storage Used"
              value={formatBytes(resourceAnalytics.totalStorage)}
              icon={FolderOpen}
              description="Total file storage"
            />
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Messages by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart
                  data={[
                    { name: "Individual Chats", value: messageAnalytics.individualChats },
                    { name: "Group Chats", value: messageAnalytics.groupChats },
                  ]}
                  dataKey="name"
                  valueKey="value"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Messages by Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart
                  data={[
                    { name: "Urgent", value: messageAnalytics.urgentConversations },
                    { name: "Important", value: messageAnalytics.importantConversations },
                    { name: "Normal", value: messageAnalytics.normalConversations },
                  ]}
                  dataKey="name"
                  valueKey="value"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Announcements by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart
                  data={Object.entries(announcementAnalytics.byCategory).map(
                    ([name, value]) => ({ name, value })
                  )}
                  dataKey="name"
                  valueKey="value"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Views</span>
                    <span className="text-lg font-bold">
                      {announcementAnalytics.totalViews}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Avg Views / Announcement
                    </span>
                    <span className="text-lg font-bold">
                      {announcementAnalytics.avgViewsPerAnnouncement.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Read Rate</span>
                    <Badge variant="default" className="text-sm">
                      {announcementAnalytics.avgReadRate.toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Announcements */}
          {announcementAnalytics.topAnnouncements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Most Viewed Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {announcementAnalytics.topAnnouncements.map((announcement, index) => (
                    <div
                      key={announcement.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium">{announcement.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {announcement.category}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        <Eye className="h-3 w-3 mr-1" />
                        {announcement.views} views
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="h-5 w-5" />
                  Resources by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(resourceAnalytics.byType).map(([type, stats]) => (
                    <div key={type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{stats.count} files</span>
                          <Badge variant="secondary">{formatBytes(stats.size)}</Badge>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{
                            width: `${(stats.size / resourceAnalytics.totalStorage) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Most Downloaded
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resourceAnalytics.mostDownloaded.map((resource, index) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{resource.name}</p>
                          <p className="text-xs text-muted-foreground">{resource.type}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        <Download className="h-3 w-3 mr-1" />
                        {resource.downloads}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
