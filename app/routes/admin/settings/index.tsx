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
      <div className="space-y-4 py-8">
        <div className="h-6 w-48 bg-light-subtle/10 dark:bg-[#131721] rounded animate-pulse" />
        <div className="h-64 w-full bg-white dark:bg-[#0a0e14] border border-light-border dark:border-[#1e2430] rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-light-border dark:border-[#1e2430]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/10 dark:bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] border border-amber-500/20">
              CONFIGURATION
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              Environment & SEO
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Site Settings
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            Configure site metadata, search indexing tags, OpenGraph previews, and notifications.
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full sm:w-80 bg-light-background/60 dark:bg-[#131721]/60 border border-light-border dark:border-[#1e2430]">
          <TabsTrigger value="general" className="flex items-center gap-2 text-xs font-mono">
            <Globe className="h-3.5 w-3.5" /> General & SEO
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 text-xs font-mono">
            <Bell className="h-3.5 w-3.5" /> Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-white dark:bg-[#0a0e14] border-light-border dark:border-[#1e2430] shadow-xs">
            <CardHeader className="pb-3 border-b border-light-border dark:border-[#1e2430]">
              <CardTitle className="text-base font-semibold text-light-text dark:text-[#bfbdb6]">Global Site & SEO Settings</CardTitle>
              <CardDescription className="text-xs text-light-subtle dark:text-[#8a9199]">
                Configure default title, description and social preview images
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <form onSubmit={handleSaveSeo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteTitle" className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">Default Page Title</Label>
                  <Input
                    id="siteTitle"
                    value={siteTitle}
                    onChange={(e) => setSiteTitle(e.target.value)}
                    required
                    className="text-xs bg-white dark:bg-[#0a0e14] border-light-border dark:border-[#1e2430]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription" className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">Meta Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    rows={3}
                    className="text-xs bg-white dark:bg-[#0a0e14] border-light-border dark:border-[#1e2430]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ogImage" className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">OpenGraph Image URL</Label>
                  <Input
                    id="ogImage"
                    type="url"
                    value={ogImage}
                    onChange={(e) => setOgImage(e.target.value)}
                    placeholder="https://example.com/og-banner.png"
                    className="text-xs bg-white dark:bg-[#0a0e14] border-light-border dark:border-[#1e2430]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#e6b450] hover:bg-[#d48b00] text-black font-mono text-xs font-semibold rounded-lg tracking-wider transition-colors shadow-xs w-full sm:w-auto"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>SAVE SETTINGS</span>
                </button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-white dark:bg-[#0a0e14] border-light-border dark:border-[#1e2430] shadow-xs">
            <CardHeader className="pb-3 border-b border-light-border dark:border-[#1e2430]">
              <CardTitle className="text-base font-semibold text-light-text dark:text-[#bfbdb6]">Email Notifications</CardTitle>
              <CardDescription className="text-xs text-light-subtle dark:text-[#8a9199]">
                Receive alerts when visitors submit messages on your contact form
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center justify-between p-4 border border-light-border dark:border-[#1e2430] rounded-xl bg-light-background/40 dark:bg-[#131721]/40">
                <div>
                  <h4 className="font-semibold text-xs text-light-text dark:text-[#bfbdb6]">Contact Form Submissions</h4>
                  <p className="text-xs text-light-subtle dark:text-[#8a9199]">
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
