import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Upload,
  CreditCard,
  Shield,
  User,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import { useUser } from "@/lib/hooks";

const AccountPage = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    avatar: "",
    company: "",
    website: "",
    bio: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      setUserData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || "user"}`,
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate saving profile
    setTimeout(() => {
      setIsSaving(false);
      alert("Profile updated successfully!");
      // In a real app, you would update the user data in localStorage or backend
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          name: userData.name,
          email: userData.email,
        }),
      );
    }, 1500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (userData.newPassword !== userData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    setIsSaving(true);
    // Simulate password change
    setTimeout(() => {
      setIsSaving(false);
      alert("Password changed successfully!");
      setUserData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Helmet>
        <title>Account Settings | VideoAI</title>
      </Helmet>

      <Sidebar activePath="/dashboard/account" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Account Settings" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger
                  value="profile"
                  className="flex items-center gap-2"
                >
                  <User size={16} />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="billing"
                  className="flex items-center gap-2"
                >
                  <CreditCard size={16} />
                  Billing & Subscription
                </TabsTrigger>
                <TabsTrigger
                  value="security"
                  className="flex items-center gap-2"
                >
                  <Shield size={16} />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account profile information and settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-start gap-6">
                      <Avatar className="w-24 h-24">
                        <AvatarImage
                          src={userData.avatar}
                          alt={userData.name}
                        />
                        <AvatarFallback>
                          {userData.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Profile Picture</h3>
                        <p className="text-sm text-muted-foreground">
                          This will be displayed on your profile and throughout
                          the application.
                        </p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="gap-2">
                            <Upload size={14} />
                            Upload New
                          </Button>
                          <Button variant="outline" size="sm">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Personal Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            placeholder="john@example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="company">Company (Optional)</Label>
                          <Input
                            id="company"
                            name="company"
                            value={userData.company}
                            onChange={handleInputChange}
                            placeholder="Company Name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website">Website (Optional)</Label>
                          <Input
                            id="website"
                            name="website"
                            value={userData.website}
                            onChange={handleInputChange}
                            placeholder="https://example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio (Optional)</Label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={userData.bio}
                          onChange={handleInputChange}
                          placeholder="Tell us a little about yourself"
                          className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
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

              {/* Billing Tab */}
              <TabsContent value="billing">
                <Card>
                  <CardHeader>
                    <CardTitle>Billing & Subscription</CardTitle>
                    <CardDescription>
                      Manage your subscription plan and payment methods.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Plan */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Current Plan</h3>
                      <Separator />

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xl font-bold">Pro Plan</h4>
                              <Badge>Current</Badge>
                            </div>
                            <p className="text-muted-foreground mt-1">
                              $19/month, billed monthly
                            </p>
                            <ul className="mt-3 space-y-1 text-sm">
                              <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> 50
                                video conversions per month
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> All
                                platform templates
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> 4K
                                resolution support
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Faster
                                processing
                              </li>
                              <li className="flex items-center gap-2">
                                <span className="text-green-500">✓</span> Batch
                                processing
                              </li>
                            </ul>
                          </div>
                          <div className="space-y-2">
                            <Button variant="outline">Change Plan</Button>
                            <Button
                              variant="outline"
                              className="w-full text-destructive hover:text-destructive"
                            >
                              Cancel Subscription
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        Your next billing date is <strong>June 15, 2023</strong>
                        . You have used <strong>28/50</strong> video conversions
                        this month.
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Payment Methods</h3>
                      <Separator />

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                              VISA
                            </div>
                            <div>
                              <p className="font-medium">Visa ending in 4242</p>
                              <p className="text-sm text-muted-foreground">
                                Expires 12/2025
                              </p>
                            </div>
                          </div>
                          <Badge>Default</Badge>
                        </div>

                        <Button variant="outline" className="gap-2">
                          <CreditCard size={16} />
                          Add Payment Method
                        </Button>
                      </div>
                    </div>

                    {/* Billing History */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Billing History</h3>
                      <Separator />

                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted/50 text-sm">
                            <tr>
                              <th className="text-left p-3 font-medium">
                                Date
                              </th>
                              <th className="text-left p-3 font-medium">
                                Description
                              </th>
                              <th className="text-left p-3 font-medium">
                                Amount
                              </th>
                              <th className="text-left p-3 font-medium">
                                Status
                              </th>
                              <th className="text-left p-3 font-medium">
                                Invoice
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y text-sm">
                            <tr>
                              <td className="p-3">May 15, 2023</td>
                              <td className="p-3">Pro Plan - Monthly</td>
                              <td className="p-3">$19.00</td>
                              <td className="p-3">
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 hover:bg-green-50"
                                >
                                  Paid
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0"
                                >
                                  Download
                                </Button>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-3">Apr 15, 2023</td>
                              <td className="p-3">Pro Plan - Monthly</td>
                              <td className="p-3">$19.00</td>
                              <td className="p-3">
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 hover:bg-green-50"
                                >
                                  Paid
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0"
                                >
                                  Download
                                </Button>
                              </td>
                            </tr>
                            <tr>
                              <td className="p-3">Mar 15, 2023</td>
                              <td className="p-3">Pro Plan - Monthly</td>
                              <td className="p-3">$19.00</td>
                              <td className="p-3">
                                <Badge
                                  variant="outline"
                                  className="bg-green-50 text-green-700 hover:bg-green-50"
                                >
                                  Paid
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="h-auto p-0"
                                >
                                  Download
                                </Button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and authentication settings.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Change Password */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <Separator />

                      <form
                        onSubmit={handleChangePassword}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">
                            Current Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type={showPassword ? "text" : "password"}
                              value={userData.currentPassword}
                              onChange={handleInputChange}
                              placeholder="••••••••"
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={userData.newPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">
                            Confirm New Password
                          </Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={userData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            required
                          />
                        </div>

                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Updating...
                            </>
                          ) : (
                            "Change Password"
                          )}
                        </Button>
                      </form>
                    </div>

                    {/* Two-Factor Authentication */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Two-Factor Authentication
                      </h3>
                      <Separator />

                      <div className="bg-muted/50 p-4 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              Two-Factor Authentication is disabled
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Add an extra layer of security to your account by
                              requiring both your password and a verification
                              code from your mobile device.
                            </p>
                          </div>
                          <Button>Enable</Button>
                        </div>
                      </div>
                    </div>

                    {/* Login Sessions */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Active Sessions</h3>
                      <Separator />

                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-muted-foreground">
                              Chrome on Windows • IP 192.168.1.1
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Started 2 hours ago
                            </p>
                          </div>
                          <Badge>Current</Badge>
                        </div>

                        <div className="flex justify-between items-center p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Mobile App</p>
                            <p className="text-sm text-muted-foreground">
                              iPhone 13 • IP 192.168.1.2
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Started 3 days ago
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            Revoke
                          </Button>
                        </div>

                        <Button variant="outline" className="w-full">
                          Logout from All Devices
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountPage;
