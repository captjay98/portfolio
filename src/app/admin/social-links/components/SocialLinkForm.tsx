import { useState } from "react";
import { SocialLinkType } from "../../../../types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

// List of common social media platforms with their icons
const SOCIAL_PLATFORMS = [
  { name: "GitHub", icon: "github" },
  { name: "Twitter", icon: "twitter" },
  { name: "LinkedIn", icon: "linkedin" },
  { name: "Facebook", icon: "facebook" },
  { name: "Instagram", icon: "instagram" },
  { name: "YouTube", icon: "youtube" },
  { name: "Medium", icon: "medium" },
  { name: "Dev.to", icon: "code" },
  { name: "Dribbble", icon: "dribbble" },
  { name: "Behance", icon: "behance" },
  { name: "Stack Overflow", icon: "stack" },
  { name: "CodePen", icon: "codepen" },
  { name: "Discord", icon: "messageSquare" },
  { name: "Email", icon: "mail" },
  { name: "Website", icon: "globe" },
  { name: "RSS", icon: "rss" },
];

interface SocialLinkFormProps {
  link?: SocialLinkType;
  onSubmit: (
    data: Omit<SocialLinkType, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  onCancel: () => void;
}

export function SocialLinkForm({
  link,
  onSubmit,
  onCancel,
}: SocialLinkFormProps) {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    // If selecting a platform from dropdown, also set the icon
    if (name === "platform" && !customPlatform) {
      const platform = SOCIAL_PLATFORMS.find((p) => p.name === value);
      if (platform) {
        setFormData({
          ...formData,
          platform: value,
          icon: platform.icon,
        });
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handlePlatformSelect = (platform: string) => {
    if (platform === "custom") {
      setCustomPlatform(true);
      setFormData({
        ...formData,
        platform: "",
        icon: "",
      });
    } else {
      setCustomPlatform(false);
      const selectedPlatform = SOCIAL_PLATFORMS.find(
        (p) => p.name === platform,
      );
      if (selectedPlatform) {
        setFormData({
          ...formData,
          platform: selectedPlatform.name,
          icon: selectedPlatform.icon,
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
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
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={customPlatform ? "custom" : formData.platform}
            onChange={(e) => handlePlatformSelect(e.target.value)}
          >
            <option value="" disabled>
              Select platform
            </option>
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
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              required
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="https://example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon</Label>
        <Input
          id="icon"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          placeholder="icon-name"
          required
        />
        <p className="text-sm text-muted-foreground">
          Enter a Lucide icon name (e.g., github, twitter, linkedin)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Display Order</Label>
        <Input
          id="priority"
          name="priority"
          type="number"
          value={formData.priority}
          onChange={(e) =>
            setFormData({ ...formData, priority: parseInt(e.target.value) })
          }
          min="0"
          required
        />
        <p className="text-sm text-muted-foreground">
          Lower numbers appear first
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_visible"
          checked={formData.is_visible}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, is_visible: checked })
          }
        />
        <Label htmlFor="is_visible">Visible</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : link ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
