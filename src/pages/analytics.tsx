import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import { api } from "@/lib/api";

// Mock data for feature usage
const featureUsageData = [
  { name: "AI Cropping", count: 78 },
  { name: "Format Conversion", count: 65 },
  { name: "Auto-Captioning", count: 42 },
  { name: "Resolution Upscaling", count: 34 },
  { name: "Color Correction", count: 28 },
];

// Mock data for platform distribution
const platformData = [
  { name: "YouTube", value: 45 },
  { name: "Instagram", value: 30 },
  { name: "TikTok", value: 15 },
  { name: "Facebook", value: 10 },
];

// Mock data for processing time
const processingTimeData = [
  { date: "Jan", time: 4.2 },
  { date: "Feb", time: 4.0 },
  { date: "Mar", time: 3.8 },
  { date: "Apr", time: 3.5 },
  { date: "May", time: 3.2 },
  { date: "Jun", time: 2.8 },
];

// Mock data for video uploads
const videoUploadsData = [
  { date: "Jan", count: 12 },
  { date: "Feb", count: 19 },
  { date: "Mar", count: 15 },
  { date: "Apr", count: 22 },
  { date: "May", count: 28 },
  { date: "Jun", count: 32 },
];

// Colors for pie chart
const PLATFORM_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("6months");
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State for analytics data
  const [videoUploads, setVideoUploads] = useState(videoUploadsData);
  const [processingTime, setProcessingTime] = useState(processingTimeData);
  const [featureUsage, setFeatureUsage] = useState(featureUsageData);
  const [platformDistribution, setPlatformDistribution] =
    useState(platformData);

  // Fetch analytics data when component mounts or timeRange changes
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.getVideoAnalytics(timeRange);

        if (response.data) {
          // Update state with real data
          if (response.data.videoUploads)
            setVideoUploads(response.data.videoUploads);
          if (response.data.processingTime)
            setProcessingTime(response.data.processingTime);
          if (response.data.featureUsage)
            setFeatureUsage(response.data.featureUsage);
          if (response.data.platformDistribution)
            setPlatformDistribution(response.data.platformDistribution);
        } else {
          throw new Error(response.error || "Failed to fetch analytics data");
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred",
        );

        // Keep using mock data as fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Helmet>
        <title>Analytics | VideoAI</title>
      </Helmet>

      <Sidebar activePath="/dashboard/analytics" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Analytics" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Time range selector */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <div className="flex items-center gap-4">
                {isLoading && (
                  <p className="text-sm text-muted-foreground">
                    Loading data...
                  </p>
                )}
                <Select
                  value={timeRange}
                  onValueChange={setTimeRange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">Last 30 Days</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 border rounded-md bg-red-50 text-red-700">
                {error}
              </div>
            )}

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="features">Feature Usage</TabsTrigger>
                <TabsTrigger value="platforms">Platform Analytics</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Video Uploads Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Video Uploads</CardTitle>
                      <CardDescription>
                        Number of videos uploaded over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={videoUploads}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke="#8884d8"
                              activeDot={{ r: 8 }}
                              name="Uploads"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Processing Time Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Average Processing Time</CardTitle>
                      <CardDescription>
                        Average time (in minutes) to process videos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={processingTime}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="time"
                              stroke="#82ca9d"
                              name="Minutes"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Feature Usage Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Feature Usage</CardTitle>
                      <CardDescription>
                        Most used features in your videos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={featureUsage}
                            layout="vertical"
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="count"
                              fill="#8884d8"
                              name="Times Used"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Platform Distribution Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Distribution</CardTitle>
                      <CardDescription>
                        Distribution of videos across platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={platformDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {platformDistribution.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    PLATFORM_COLORS[
                                      index % PLATFORM_COLORS.length
                                    ]
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Feature Usage Tab */}
              <TabsContent value="features">
                <Card>
                  <CardHeader>
                    <CardTitle>Feature Selection Stats</CardTitle>
                    <CardDescription>
                      Track which features are most used in your video
                      processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={featureUsage}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="count"
                            fill="#8884d8"
                            name="Times Used"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6 space-y-4">
                      <h3 className="text-lg font-medium">Feature Insights</h3>
                      <p className="text-sm text-muted-foreground">
                        AI Cropping is your most used feature, accounting for
                        31.6% of all feature usage. Consider exploring more
                        advanced options within this feature to maximize its
                        benefits.
                      </p>
                      <h4 className="text-md font-medium mt-4">
                        Recommendations
                      </h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li>
                          Try using Auto-Captioning more frequently to improve
                          video accessibility
                        </li>
                        <li>
                          Explore Color Correction features to enhance video
                          quality
                        </li>
                        <li>
                          Consider using batch processing to apply multiple
                          features at once
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Platform Analytics Tab */}
              <TabsContent value="platforms">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Distribution</CardTitle>
                      <CardDescription>
                        Distribution of videos across platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={platformDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                              }
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {platformDistribution.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={
                                    PLATFORM_COLORS[
                                      index % PLATFORM_COLORS.length
                                    ]
                                  }
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Platform Performance</CardTitle>
                      <CardDescription>
                        Engagement metrics by platform
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">YouTube</span>
                            <span className="text-sm text-muted-foreground">
                              45% of videos
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="bg-blue-500 h-full rounded-full"
                              style={{ width: "78%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>78% engagement rate</span>
                            <span>Avg. watch time: 4:32</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Instagram
                            </span>
                            <span className="text-sm text-muted-foreground">
                              30% of videos
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="bg-green-500 h-full rounded-full"
                              style={{ width: "65%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>65% engagement rate</span>
                            <span>Avg. watch time: 0:48</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">TikTok</span>
                            <span className="text-sm text-muted-foreground">
                              15% of videos
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="bg-yellow-500 h-full rounded-full"
                              style={{ width: "92%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>92% engagement rate</span>
                            <span>Avg. watch time: 0:22</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Facebook
                            </span>
                            <span className="text-sm text-muted-foreground">
                              10% of videos
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="bg-orange-500 h-full rounded-full"
                              style={{ width: "45%" }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>45% engagement rate</span>
                            <span>Avg. watch time: 1:15</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Platform Recommendations</CardTitle>
                      <CardDescription>
                        Insights to improve your cross-platform strategy
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h3 className="text-lg font-medium text-blue-700">
                            YouTube Strategy
                          </h3>
                          <p className="mt-1 text-sm text-blue-600">
                            Your YouTube videos have good engagement but could
                            be optimized further. Consider creating longer-form
                            content (8-12 minutes) to maximize watch time and
                            algorithm favorability.
                          </p>
                        </div>

                        <div className="p-4 bg-green-50 rounded-lg">
                          <h3 className="text-lg font-medium text-green-700">
                            Instagram Strategy
                          </h3>
                          <p className="mt-1 text-sm text-green-600">
                            Your Instagram videos perform moderately well. Try
                            using more vertical 9:16 aspect ratios and keep
                            videos under 60 seconds for better engagement in
                            Reels.
                          </p>
                        </div>

                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h3 className="text-lg font-medium text-yellow-700">
                            TikTok Strategy
                          </h3>
                          <p className="mt-1 text-sm text-yellow-600">
                            TikTok is your highest-performing platform by
                            engagement rate. Consider allocating more resources
                            here and experimenting with trending sounds and
                            effects.
                          </p>
                        </div>

                        <div className="p-4 bg-orange-50 rounded-lg">
                          <h3 className="text-lg font-medium text-orange-700">
                            Facebook Strategy
                          </h3>
                          <p className="mt-1 text-sm text-orange-600">
                            Your Facebook videos have the lowest engagement.
                            Focus on creating more shareable content with strong
                            hooks in the first 3 seconds to improve performance.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
