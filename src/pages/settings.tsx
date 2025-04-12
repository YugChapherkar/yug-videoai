import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Save, RefreshCw } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = () => {
    setIsSaving(true);
    // Simulate saving settings
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings saved successfully!");
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Helmet>
        <title>Settings | VideoAI</title>
      </Helmet>

      <Sidebar activePath="/dashboard/settings" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Settings" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="api">API & Integrations</TabsTrigger>
              </TabsList>

              {/* General Settings */}
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Manage your application preferences and account settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Interface</h3>
                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="dark-mode">Dark Mode</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable dark mode for the application interface
                          </p>
                        </div>
                        <Switch id="dark-mode" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-save">Auto-Save</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically save changes to projects
                          </p>
                        </div>
                        <Switch id="auto-save" defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Language & Region</h3>
                      <Separator />

                      <div className="grid gap-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="ja">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="utc">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select timezone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="utc">
                              UTC (Coordinated Universal Time)
                            </SelectItem>
                            <SelectItem value="est">
                              EST (Eastern Standard Time)
                            </SelectItem>
                            <SelectItem value="pst">
                              PST (Pacific Standard Time)
                            </SelectItem>
                            <SelectItem value="cet">
                              CET (Central European Time)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button onClick={handleSaveSettings} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Video Settings */}
              <TabsContent value="video">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Settings</CardTitle>
                    <CardDescription>
                      Configure default settings for video processing and
                      output.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Default Output Settings
                      </h3>
                      <Separator />

                      <div className="grid gap-2">
                        <Label htmlFor="default-resolution">
                          Default Resolution
                        </Label>
                        <Select defaultValue="1080p">
                          <SelectTrigger id="default-resolution">
                            <SelectValue placeholder="Select resolution" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="720p">720p</SelectItem>
                            <SelectItem value="1080p">1080p</SelectItem>
                            <SelectItem value="1440p">1440p</SelectItem>
                            <SelectItem value="4k">4K</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="default-format">Default Format</Label>
                        <Select defaultValue="mp4">
                          <SelectTrigger id="default-format">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="mp4">MP4</SelectItem>
                            <SelectItem value="mov">MOV</SelectItem>
                            <SelectItem value="webm">WebM</SelectItem>
                            <SelectItem value="avi">AVI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="default-platform">
                          Default Platform
                        </Label>
                        <Select defaultValue="youtube">
                          <SelectTrigger id="default-platform">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Processing Options
                      </h3>
                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-enhance">Auto-Enhance</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically enhance video quality
                          </p>
                        </div>
                        <Switch id="auto-enhance" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="auto-caption">Auto-Caption</Label>
                          <p className="text-sm text-muted-foreground">
                            Automatically generate captions
                          </p>
                        </div>
                        <Switch id="auto-caption" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="smart-crop">Smart Crop</Label>
                          <p className="text-sm text-muted-foreground">
                            Use AI to intelligently crop videos
                          </p>
                        </div>
                        <Switch id="smart-crop" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button onClick={handleSaveSettings} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Notifications Settings */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Configure how and when you receive notifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Email Notifications
                      </h3>
                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-processing-complete">
                            Processing Complete
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive an email when video processing is complete
                          </p>
                        </div>
                        <Switch id="email-processing-complete" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-weekly-summary">
                            Weekly Summary
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive a weekly summary of your account activity
                          </p>
                        </div>
                        <Switch id="email-weekly-summary" />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="email-marketing">
                            Marketing & Updates
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Receive emails about new features and promotions
                          </p>
                        </div>
                        <Switch id="email-marketing" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        In-App Notifications
                      </h3>
                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="app-processing-updates">
                            Processing Updates
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Show notifications for video processing status
                          </p>
                        </div>
                        <Switch id="app-processing-updates" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="app-tips">Tips & Suggestions</Label>
                          <p className="text-sm text-muted-foreground">
                            Show helpful tips while using the application
                          </p>
                        </div>
                        <Switch id="app-tips" defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset to Defaults</Button>
                    <Button onClick={handleSaveSettings} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* API & Integrations Settings */}
              <TabsContent value="api">
                <Card>
                  <CardHeader>
                    <CardTitle>API & Integrations</CardTitle>
                    <CardDescription>
                      Manage API keys and third-party integrations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">API Access</h3>
                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="api-key">API Key</Label>
                        <div className="flex gap-2">
                          <Input
                            id="api-key"
                            value="sk_live_51KjdU2CjK8zXtT6Y9g7hJ5tP"
                            readOnly
                            className="font-mono"
                          />
                          <Button variant="outline">Copy</Button>
                          <Button variant="outline">Regenerate</Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Use this key to access the VideoAI API
                          programmatically
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="api-access">Enable API Access</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow programmatic access to your account
                          </p>
                        </div>
                        <Switch id="api-access" defaultChecked />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Connected Services
                      </h3>
                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                              <span className="text-red-600 font-bold">YT</span>
                            </div>
                            <div>
                              <p className="font-medium">YouTube</p>
                              <p className="text-sm text-muted-foreground">
                                Not connected
                              </p>
                            </div>
                          </div>
                          <Button variant="outline">Connect</Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <span className="text-purple-600 font-bold">
                                IG
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">Instagram</p>
                              <p className="text-sm text-muted-foreground">
                                Connected as @username
                              </p>
                            </div>
                          </div>
                          <Button variant="outline">Disconnect</Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-bold">
                                FB
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">Facebook</p>
                              <p className="text-sm text-muted-foreground">
                                Not connected
                              </p>
                            </div>
                          </div>
                          <Button variant="outline">Connect</Button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                              <span className="text-white font-bold">TT</span>
                            </div>
                            <div>
                              <p className="font-medium">TikTok</p>
                              <p className="text-sm text-muted-foreground">
                                Not connected
                              </p>
                            </div>
                          </div>
                          <Button variant="outline">Connect</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Disconnect All</Button>
                    <Button onClick={handleSaveSettings} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
