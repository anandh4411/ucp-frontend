import { useState } from "react";
import {
  Activity,
  Users,
  MessageSquare,
  Megaphone,
  FolderOpen,
  TrendingUp,
  Clock,
  Server,
  Download,
  Eye,
  BarChart3,
  PieChart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirebaseStats } from "@/hooks/useFirebaseStats";
import analyticsData from "@/data/analytics.json";

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
          <TrendingUp
            className={`h-3 w-3 mr-1 ${!trendUp && "rotate-180"}`}
          />
          {trend}
        </div>
      )}
    </CardContent>
  </Card>
);

// Simple Bar Chart Component
const SimpleBarChart = ({ data, dataKey, valueKey, title }: any) => {
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

// Simple Line Chart Component (Weekly Activity)
const SimpleLineChart = ({ data }: any) => {
  const maxValue = Math.max(...data.map((item: any) => item.users));
  const minValue = Math.min(...data.map((item: any) => item.users));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between h-40 gap-2">
        {data.map((item: any, index: number) => {
          const heightPercent =
            ((item.users - minValue) / (maxValue - minValue)) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-32">
                <div
                  className="bg-primary rounded-t-md w-full transition-all hover:opacity-80"
                  style={{ height: `${heightPercent}%`, minHeight: "20px" }}
                  title={`${item.users} users`}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(item.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Pie Chart Component (using simple CSS)
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
        const percentage = ((item[valueKey] / total) * 100).toFixed(1);
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

export default function Analytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const stats = useFirebaseStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground">
            Communication trends and user engagement metrics
          </p>
        </div>
        <Badge variant="default" className="text-sm">
          Last updated: {new Date().toLocaleDateString()}
        </Badge>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.loading ? "..." : stats.totalUsers}
          icon={Users}
          description={`${stats.activeUsers} active users`}
        />
        <StatCard
          title="Conversations"
          value={stats.loading ? "..." : stats.totalConversations}
          icon={MessageSquare}
          description="All conversations"
        />
        <StatCard
          title="Announcements"
          value={stats.loading ? "..." : stats.totalAnnouncements}
          icon={Megaphone}
          description="Published announcements"
        />
        <StatCard
          title="Resources Shared"
          value={stats.loading ? "..." : stats.totalResources}
          icon={FolderOpen}
          description="Documents & files"
        />
      </div>

      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* User Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Daily Active Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleLineChart data={analyticsData.userActivity.daily} />
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">System Uptime</span>
                    <Badge variant="default">
                      {analyticsData.performanceMetrics.systemUptime}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Load Time</span>
                    <Badge variant="secondary">
                      {analyticsData.performanceMetrics.avgLoadTime}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Error Rate</span>
                    <Badge variant="secondary">
                      {analyticsData.performanceMetrics.errorRate}%
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">API Response</span>
                    <Badge variant="secondary">
                      {analyticsData.performanceMetrics.apiResponseTime}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Response Time</span>
                    <Badge variant="secondary">
                      {analyticsData.overview.avgResponseTime}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Messages by Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart
                  data={analyticsData.messageStats.byType}
                  dataKey="type"
                  valueKey="count"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Messages by Priority
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart
                  data={analyticsData.messageStats.byPriority}
                  dataKey="priority"
                  valueKey="count"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Message Response Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Responded</span>
                  <span className="text-2xl font-bold text-green-600">
                    {analyticsData.messageStats.responseRate.responded}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Pending</span>
                  <span className="text-2xl font-bold text-yellow-600">
                    {analyticsData.messageStats.responseRate.pending}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className="bg-green-600 rounded-full h-3"
                    style={{
                      width: `${analyticsData.messageStats.responseRate.rate}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {analyticsData.messageStats.responseRate.rate}% response rate
                </p>
              </div>
            </CardContent>
          </Card>
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
                <SimpleBarChart
                  data={analyticsData.announcementStats.byCategory}
                  dataKey="category"
                  valueKey="count"
                  title="Category Distribution"
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
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Views</span>
                  <span className="text-2xl font-bold">
                    {analyticsData.announcementStats.engagement.totalViews}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Avg Views/Post</span>
                  <Badge variant="secondary">
                    {analyticsData.announcementStats.engagement.avgViewsPerAnnouncement}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Read Rate</span>
                  <Badge variant="default">
                    {analyticsData.announcementStats.engagement.readRate}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  {analyticsData.resourceUsage.byType.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.type}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{item.count}</span>
                          <Badge variant="secondary">{item.size}</Badge>
                        </div>
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
                  {analyticsData.resourceUsage.mostDownloaded.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg border"
                    >
                      <div className="space-y-1 flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.category}
                        </p>
                      </div>
                      <Badge variant="default">{item.downloads} downloads</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Login Frequency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart
                  data={[
                    {
                      label: "Daily",
                      value: analyticsData.engagementMetrics.loginFrequency.daily,
                    },
                    {
                      label: "Weekly",
                      value: analyticsData.engagementMetrics.loginFrequency.weekly,
                    },
                    {
                      label: "Monthly",
                      value: analyticsData.engagementMetrics.loginFrequency.monthly,
                    },
                  ]}
                  dataKey="label"
                  valueKey="value"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Device Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimplePieChart
                  data={analyticsData.engagementMetrics.deviceBreakdown.map(
                    (item) => ({
                      device: item.device,
                      percentage: item.percentage,
                    })
                  )}
                  dataKey="device"
                  valueKey="percentage"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Peak Activity Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleBarChart
                data={analyticsData.engagementMetrics.peakHours}
                dataKey="hour"
                valueKey="users"
                title="Peak Hours"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
