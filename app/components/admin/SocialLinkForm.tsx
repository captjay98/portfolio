import { useState } from "react";
import { SocialLinkType } from "@app/types/admin";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { Label } from "@app/components/ui/label";
import { Switch } from "@app/components/ui/switch";

const SOCIAL_PLATFORMS = [
  { name: "GitHub", icon: "github" },
  { name: "Twitter", icon: "twitter" },
  { name: "LinkedIn", icon: "linkedin" },
  { name: "Facebook", icon: "facebook" },
  { name: "Instagram", icon: "instagram" },
  { name: "YouTube", icon: "youtube" },
  { name: "Medium", icon: "medium" },
  { name: "Dev.to", icon: "code" },
  { name: "Discord", icon: "messageSquare" },
  { name: "Email", icon: "mail" },
  { name: "Website", icon: "globe" },
];

interface SocialLinkFormProps {
  link?: SocialLinkType;
  onSubmit: (
    data: Omit<SocialLinkType, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  onCancel: () => void;
}

export function SocialLinkForm({ link, onSubmit, onCancel }: SocialLinkFormProps) {
  const [formData, setFormData] = useState({
    platform: link?.platform || "",
    url: link?.url || "",
    icon: link?.icon || "",
    priority: link?.priority || 0,
    is_visible: link?.is_visible ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [customPlatform, setCustomPlatform] = useState(
    !SOCIAL_PLATFORMS.some((p) => p.name === link?.platform),
  );

  const handlePlatformSelect = (platform: string) => {
    if (platform === "custom") {
      setCustomPlatform(true);
      setFormData({ ...formData, platform: "", icon: "" });
    } else {
      setCustomPlatform(false);
      const selected = SOCIAL_PLATFORMS.find((p) => p.name === platform);
      if (selected) {
        setFormData({ ...formData, platform: selected.name, icon: selected.icon });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Platform</Label>
        <div className="grid grid-cols-2 gap-2">
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none"
            value={customPlatform ? "custom" : formData.platform}
            onChange={(e) => handlePlatformSelect(e.target.value)}
          >
            <option value="" disabled>Select platform</option>
            {SOCIAL_PLATFORMS.map((platform) => (
              <option key={platform.name} value={platform.name}>
                {platform.name}
              </option>
            ))}
            <option value="custom">Custom Platform</option>
          </select>

          {customPlatform && (
            <Input
              placeholder="Platform name"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
              required
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon Name</Label>
        <Input
          id="icon"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="e.g. github, twitter, linkedin"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority Order</Label>
        <Input
          id="priority"
          type="number"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="is_visible"
          checked={formData.is_visible}
          onCheckedChange={(checked) => setFormData({ ...formData, is_visible: checked })}
        />
        <Label htmlFor="is_visible">Visible on public portfolio</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {link ? "Update" : "Create"} Link
        </Button>
      </div>
    </form>
  );
}
