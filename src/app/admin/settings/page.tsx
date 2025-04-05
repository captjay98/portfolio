/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Key, Bell, Globe, Shield } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { account } from "@/lib/appwrite";

// Import Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { profileService } from "@/services/profileService";
import { siteSettingsService } from "@/services/siteSettingsService";

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [status] = useState<{ success?: boolean; message?: string }>({});

  // State for form data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [emailPasswordConfirm, setEmailPasswordConfirm] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(false);

  // Site settings
  const [, setSiteSettings] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  // SEO settings
  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [ogImage, setOgImage] = useState("");

  // Load profile and settings data
  useEffect(() => {
    async function loadData() {
      try {
        // Get current user info from Appwrite account
        try {
          if (!account) {
            throw new Error("Account is not initialized");
          }
          const user = await account.get();
          setFullName(user.name || "");
          setEmail(user.email || "");
        } catch (error) {
          console.error("Error fetching user account:", error);
          toast.error("Could not fetch account information");
        }

        // Load notification preference from site settings
        const settings = await siteSettingsService.getAllSettings();
        setSiteSettings(settings);

        // Set email notifications based on settings
        setEmailNotifications(settings.emailNotifications === "true");

        // Set SEO settings
        setSiteTitle(settings.siteTitle || "");
        setSiteDescription(settings.siteDescription || "");
        setOgImage(settings.ogImage || "");

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading settings data:", error);
        toast.error("Failed to load settings data");
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle name update
  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Update name in Appwrite and get the updated user
      await profileService.updateProfileName(fullName);

      // Also update the profile in the database if needed
      const profile = await profileService.getProfile();
      if (profile && profile.id) {
        await profileService.updateProfile({ full_name: fullName });
      }

      toast.success("Your name has been updated");
    } catch {
      toast.error("Failed to update your name. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle email update
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email cannot be empty");
      return;
    }

    if (!emailPasswordConfirm) {
      toast.error("Password is required to update email");
      return;
    }

    setIsSaving(true);

    try {
      await profileService.updateProfileEmail(email, emailPasswordConfirm);
      setEmailPasswordConfirm("");
      toast.success("Your email has been updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update email");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    setIsSaving(true);

    try {
      await profileService.updatePassword(currentPassword, newPassword);

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      toast.success("Your password has been updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle notification preferences update
  const handleNotificationUpdate = async () => {
    setIsSaving(true);

    try {
      await siteSettingsService.updateSetting(
        "emailNotifications",
        emailNotifications.toString(),
      );
      toast.success("Notification preferences updated");
    } catch (error: any) {
      toast.error(
        ` Failed to update notification preferences ${error.message}`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Handle SEO settings update
  const handleSeoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await Promise.all([
        siteSettingsService.updateSetting("siteTitle", siteTitle),
        siteSettingsService.updateSetting("siteDescription", siteDescription),
        siteSettingsService.updateSetting("ogImage", ogImage),
      ]);

      toast.success("SEO settings updated successfully");
    } catch (error: any) {
      toast.error(`Failed to update SEO settings  ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Toast container */}
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      {/* Status message */}
      {status.message && (
        <Alert variant={status.success ? "default" : "destructive"}>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-8 lg:space-y-0">
        <div className="flex-1">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">SEO</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
            </TabsList>

            {/* Account Settings Tab */}
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Name update form */}
                  <form onSubmit={handleNameUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Update Name"}
                    </Button>
                  </form>

                  <Separator className="my-4" />

                  {/* Email update form */}
                  <form onSubmit={handleEmailUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-password">
                        Password (required to update email)
                      </Label>
                      <Input
                        id="email-password"
                        type="password"
                        value={emailPasswordConfirm}
                        onChange={(e) =>
                          setEmailPasswordConfirm(e.target.value)
                        }
                        placeholder="Enter your password"
                      />
                    </div>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Update Email"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={(checked) =>
                        setEmailNotifications(checked === true)
                      }
                    />
                    <Label htmlFor="email-notifications">
                      Email notifications
                    </Label>
                  </div>

                  <Button
                    onClick={handleNotificationUpdate}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* SEO Settings Tab */}
            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSeoUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="site-title">Site Title</Label>
                      <Input
                        id="site-title"
                        value={siteTitle}
                        onChange={(e) => setSiteTitle(e.target.value)}
                        placeholder="Site title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="site-description">Site Description</Label>
                      <Textarea
                        id="site-description"
                        value={siteDescription}
                        onChange={(e) => setSiteDescription(e.target.value)}
                        placeholder="Site description"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="og-image">Open Graph Image URL</Label>
                      <Input
                        id="og-image"
                        value={ogImage}
                        onChange={(e) => setOgImage(e.target.value)}
                        placeholder="Open Graph image URL"
                      />
                      <p className="text-sm text-muted-foreground">
                        This image will be displayed when your site is shared on
                        social media.
                      </p>
                    </div>

                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Saving..." : "Update SEO Settings"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>

                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
