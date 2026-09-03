import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Globe, Bell, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@app/components/ui/card';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import { Switch } from '@app/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import { siteSettingsService } from '@app/services/siteSettingsService';

export const Route = createFileRoute('/admin/settings/')({
  component: AdminSettings,
});

function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [siteTitle, setSiteTitle] = useState('Jamal Ibrahim Umar | Software Engineer');
  const [siteDescription, setSiteDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const settings = await siteSettingsService.getAllSettings();
        if (settings.siteTitle) setSiteTitle(settings.siteTitle);
        if (settings.siteDescription) setSiteDescription(settings.siteDescription);
        if (settings.ogImage) setOgImage(settings.ogImage);
        setEmailNotifications(settings.emailNotifications === 'true');
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await siteSettingsService.saveSetting('siteTitle', siteTitle);
      await siteSettingsService.saveSetting('siteDescription', siteDescription);
      await siteSettingsService.saveSetting('ogImage', ogImage);
      toast.success('Site settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async (checked: boolean) => {
    setEmailNotifications(checked);
    try {
      await siteSettingsService.saveSetting('emailNotifications', checked ? 'true' : 'false');
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error saving notification setting:', error);
      toast.error('Failed to save preference');
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 w-full bg-muted/30 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Site Settings</h2>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> General & SEO
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Global Site & SEO Settings</CardTitle>
              <CardDescription>
                Configure default title, description and social preview images
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSeo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle">Default Page Title</Label>
                  <Input
                    id="siteTitle"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Meta Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogImage">OpenGraph Image URL</Label>
                  <Input
                    id="ogImage"
                    type="url"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://example.com/og-banner.png"
                  />
                </div>

                <Button type="submit" disabled={isSaving} className="flex items-center gap-2">
                  <Save className="h-4 w-4" /> Save Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Receive alerts when visitors submit messages on your contact form
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm">Contact Form Submissions</h4>
                  <p className="text-xs text-muted-foreground">
                    Get an email notification when a new contact message is received
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={handleSaveNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
