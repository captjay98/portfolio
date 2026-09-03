import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Loader2, Save, FileText } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import { MarkdownRenderer } from '@app/components/markdown-renderer';
import { toast } from 'sonner';
import { ProfileType } from '@app/types/admin';
import { profileService } from '@app/services/profileService';

export const Route = createFileRoute('/admin/profile/')({
  component: ProfileAdmin,
});

function ProfileAdmin() {
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('general');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const data = await profileService.getProfile();
        if (data) {
          setProfile(data);
          setAvatarPreview(data.avatar || null);
          setCoverPreview(data.cover_image || null);

          if (data.resume_url) {
            const fileName = data.resume_url.split('/').pop();
            setResumeFileName(fileName || 'resume.pdf');
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (profile) {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setResumeFileName(file.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setSaving(true);
      const profileData = {
        full_name: profile.full_name,
        nickname: profile.nickname,
        title: profile.title,
        bio_short: profile.bio_short,
        bio_long: profile.bio_long,
        location: profile.location,
        meta_description: profile.meta_description,
      };

      await profileService.updateProfile(
        profileData,
        avatarFile || undefined,
        coverFile || undefined,
      );

      if (resumeFile) {
        await profileService.uploadResume(resumeFile);
      }

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 pb-20 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <Button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="about">About Me</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={profile.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    value={profile.nickname || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={profile.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={profile.location || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resume">Resume / CV</Label>
                <div className="flex flex-col gap-2">
                  {resumeFileName && (
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Current: {resumeFileName}</span>
                    </div>
                  )}
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bio & Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio_short">Short Bio</Label>
                <Textarea
                  id="bio_short"
                  name="bio_short"
                  value={profile.bio_short}
                  onChange={handleChange}
                  rows={3}
                  maxLength={500}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio_long">Full Bio (Markdown supported)</Label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Textarea
                    id="bio_long"
                    name="bio_long"
                    value={profile.bio_long}
                    onChange={handleChange}
                    rows={16}
                    className="font-mono text-sm"
                  />
                  <div className="border rounded-md p-4 overflow-auto max-h-[350px]">
                    <MarkdownRenderer content={profile.bio_long} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Media & Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture</Label>
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {avatarPreview && (
                    <div className="w-28 h-28 overflow-hidden rounded-full border">
                      <img src={avatarPreview} alt="Avatar" className="object-cover w-full h-full" />
                    </div>
                  )}
                  <div className="flex-1">
                    <Input id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover">Cover Image</Label>
                <div className="flex flex-col gap-4">
                  {coverPreview && (
                    <div className="w-full h-40 overflow-hidden rounded-md border">
                      <img src={coverPreview} alt="Cover" className="object-cover w-full h-full" />
                    </div>
                  )}
                  <Input id="cover" type="file" accept="image/*" onChange={handleCoverChange} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="meta_description">Meta Description</Label>
                <Textarea
                  id="meta_description"
                  name="meta_description"
                  value={profile.meta_description || ''}
                  onChange={handleChange}
                  rows={4}
                  maxLength={500}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
