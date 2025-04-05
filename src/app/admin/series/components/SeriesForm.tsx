import { useState, useEffect, useRef } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { BlogSeriesType } from "../../../../types/admin";
import { SeriesPostsManager } from "./SeriesPostsManager";
import Image from "next/image";
import { getImageSrc } from "@/utils/imageUtils";

type SeriesFormProps = {
  series?: BlogSeriesType;
  onSubmit: (
    data: Omit<BlogSeriesType, "id" | "created_at" | "updated_at">,
    imageFile?: File,
  ) => Promise<void>;
  isSubmitting: boolean;
};

export default function SeriesForm({ series, isSubmitting }: SeriesFormProps) {
  // Form data
  const [formData, setFormData] = useState({
    title: series?.title || "",
    slug: series?.slug || "",
    description: series?.description || "",
    image: series?.image || "",
    image_id: series?.image_id || "",
    status: series?.status || "ongoing",
  });

  // For image upload
  const [, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    series?.image || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Generate slug from title if needed
  useEffect(() => {
    if (formData.title && !formData.slug) {
      setFormData({
        ...formData,
        slug: generateSlug(formData.title),
      });
    }
  }, [formData]);

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-");
  };

  // Update slug when title changes
  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      // Only auto-update slug if it was empty or matches previous auto-generated slug
      slug:
        !formData.slug || formData.slug === generateSlug(formData.title)
          ? generateSlug(title)
          : formData.slug,
    });
  };

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setValidationErrors({
          ...validationErrors,
          image: "Image size must be less than 5MB",
        });
        return;
      }

      // Clear previous validation errors
      const newErrors = { ...validationErrors };
      delete newErrors.image;
      setValidationErrors(newErrors);

      setImageFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Trigger file input click
  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFormData({
      ...formData,
      image: "",
      image_id: "",
    });
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Series title is required";
    }

    if (!formData.slug.trim()) {
      errors.slug = "URL slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug =
        "Slug must contain only lowercase letters, numbers, and hyphens";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 160px)" }}>
      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* Main scrollable container that includes both form and SeriesPostsManager */}
      <div className="flex-grow overflow-y-auto pr-1">
        <div className="space-y-6 pb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {/* Title and Slug in a grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className={
                        validationErrors.title ? "text-destructive" : ""
                      }
                    >
                      Series Title*
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className={
                        validationErrors.title ? "border-destructive" : ""
                      }
                      placeholder="Enter series title"
                    />
                    {validationErrors.title && (
                      <p className="text-sm text-destructive">
                        {validationErrors.title}
                      </p>
                    )}
                  </div>

                  {/* Slug */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="slug"
                      className={
                        validationErrors.slug ? "text-destructive" : ""
                      }
                    >
                      URL Slug*
                    </Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      className={
                        validationErrors.slug ? "border-destructive" : ""
                      }
                      placeholder="series-url-slug"
                    />
                    {validationErrors.slug ? (
                      <p className="text-sm text-destructive">
                        {validationErrors.slug}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        This will be used in the URL: /blog/series/your-slug
                      </p>
                    )}
                  </div>
                </div>

                {/* Description and Status in a grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description of this series"
                      rows={3}
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Series Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          status: value as "ongoing" | "completed",
                        })
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Whether this series is still active or completed
                    </p>
                  </div>
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <Label
                    className={validationErrors.image ? "text-destructive" : ""}
                  >
                    Cover Image (Optional)
                  </Label>

                  {previewUrl ? (
                    <div className="relative border rounded-md overflow-hidden h-40">
                      <Image
                        width={50}
                        height={50}
                        src={getImageSrc(previewUrl)}
                        alt="Cover image preview"
                        className="object-cover w-full h-full"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 rounded-full"
                        onClick={handleRemoveImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`border ${validationErrors.image ? "border-destructive" : "border-dashed"} rounded-md p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors`}
                      onClick={handleSelectImage}
                    >
                      <ImageIcon
                        className={`mx-auto h-10 w-10 ${validationErrors.image ? "text-destructive" : "text-muted-foreground"} mb-2`}
                      />
                      <p
                        className={`text-sm ${validationErrors.image ? "text-destructive" : "text-muted-foreground"}`}
                      >
                        Click to upload a cover image
                      </p>
                    </div>
                  )}
                  {validationErrors.image && (
                    <p className="text-sm text-destructive">
                      {validationErrors.image}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Only show series posts manager when editing an existing series */}
          {series && series.id && (
            <SeriesPostsManager
              seriesId={series.id}
              onUpdate={() => {
                // Optionally refresh data or notify when posts are updated
              }}
            />
          )}
        </div>
      </div>

      {/* Fixed footer with submit button */}
      <div className="border-t p-4 bg-card mt-auto sticky bottom-0">
        <div className="flex justify-end">
          <Button onClick={validateForm} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {series ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{series ? "Update" : "Create"} Series</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
