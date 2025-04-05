import { useState, useEffect, useRef } from "react";
import {
  Loader2,
  X,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  Save,
  FileUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedMarkdownEditor } from "@/components/markdown-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BlogPostType,
  BlogSeriesType,
  CategoryType,
  TechnologyType,
} from "../../../../types/admin";
import { categoryService } from "@/services/categoryService";
import { technologyService } from "@/services/technologyService";
import { blogService } from "@/services/blogService";
import Image from "next/image";
import { getImageSrc } from "@/utils/imageUtils";

interface SimpleBlogFormProps {
  blog?: BlogPostType;
  onSubmit: (
    data: Omit<BlogPostType, "id" | "created_at" | "updated_at">,
    cover_imageFile?: File,
  ) => Promise<void>;
  isSubmitting: boolean;
  onCancel: () => void;
}

export default function SimpleBlogForm({
  blog,
  onSubmit,
  isSubmitting,
  onCancel,
}: SimpleBlogFormProps) {
  const [activeTab, setActiveTab] = useState("content");

  // Form data
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    cover_image: blog?.cover_image || "",
    cover_image_id: blog?.cover_image_id || "",
    date: blog?.date || new Date().toISOString().split("T")[0],
    reading_time: blog?.reading_time || "",
    featured: blog?.featured || false,
    status: blog?.status || "draft",
    series_id: blog?.series_id || "",
    series_position: blog?.series_position?.toString() || "",
    recommended_next_read_id: blog?.recommended_next_read_id || "",
  });

  // Collections
  const [selectedCategory_ids, setSelectedCategory_ids] = useState<string[]>(
    blog?.category_ids || [],
  );
  const [selectedTag_ids, setSelectedTag_ids] = useState<string[]>(
    blog?.tag_ids || [],
  );
  const [selectedTechnology_ids, setSelectedTechnology_ids] = useState<
    string[]
  >(blog?.technology_ids || []);
  const [selectedRelatedPosts] = useState<string[]>(
    blog?.related_post_ids || [],
  );
  const [tagInput, setTagInput] = useState("");

  // For image upload
  const [cover_imageFile, setCover_imageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    blog?.cover_image || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data loading
  const [category_ids, setCategory_ids] = useState<CategoryType[]>([]);
  const [technology_ids, setTechnology_ids] = useState<TechnologyType[]>([]);
  const [series, setSeries] = useState<BlogSeriesType[]>([]);
  const [, setAllPosts] = useState<BlogPostType[]>([]);
  const [loading, setLoading] = useState(true);

  // Validation
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [category_idsData, technology_idsData, seriesData, postsData] =
          await Promise.all([
            categoryService.getCategories(),
            technologyService.getTechnologies(),
            blogService.getAllSeries(),
            blogService.getBlogs(),
          ]);

        setCategory_ids(category_idsData);
        setTechnology_ids(technology_idsData);
        setSeries(seriesData);

        // Filter out the current blog from the posts list (for related posts selection)
        const filteredPosts = blog
          ? postsData.filter((post) => post.id !== blog.id)
          : postsData;
        setAllPosts(filteredPosts);
      } catch (error) {
        console.error("Error loading form data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [blog]); // Keep this effect only for loading data, not for slug generation

  // Separate effect for slug generation based on title
  useEffect(() => {
    // Only generate slug from title if title exists and slug doesn't
    if (formData.title && !formData.slug) {
      const generatedSlug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Remove special chars
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Replace consecutive hyphens with single hyphen

      setFormData((prevFormData) => ({
        ...prevFormData,
        slug: generatedSlug,
      }));
    }
  }, [formData.title, formData.slug]); // Only depend on the specific properties used

  // Generate slug from title
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-");
  };

  // Update form data
  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
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
          cover_image: "Image size must be less than 5MB",
        });
        return;
      }

      // Clear previous validation errors
      const newErrors = { ...validationErrors };
      delete newErrors.cover_image;
      setValidationErrors(newErrors);

      setCover_imageFile(file);

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
    setCover_imageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFormData({
      ...formData,
      cover_image: "",
      cover_image_id: "",
    });
  };

  // Handle tag input (comma or enter to add)
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,/g, "");
      if (newTag && !selectedTag_ids.includes(newTag)) {
        setSelectedTag_ids([...selectedTag_ids, newTag]);
      }
      setTagInput("");
    }
  };

  // Add tag from input field
  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTag_ids.includes(tagInput.trim())) {
      setSelectedTag_ids([...selectedTag_ids, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove tag
  const handleRemoveTag = (tag: string) => {
    setSelectedTag_ids(selectedTag_ids.filter((t) => t !== tag));
  };

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategory_ids(
      selectedCategory_ids.includes(categoryId)
        ? selectedCategory_ids.filter((id) => id !== categoryId)
        : [...selectedCategory_ids, categoryId],
    );
  };

  // Toggle technology selection
  const toggleTechnology = (techId: string) => {
    setSelectedTechnology_ids(
      selectedTechnology_ids.includes(techId)
        ? selectedTechnology_ids.filter((id) => id !== techId)
        : [...selectedTechnology_ids, techId],
    );
  };

  // Calculate reading time based on content length
  const calculateReading_time = (content: string): string => {
    const wordsPerMinute = 225;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  };

  // Series handling
  const handleSeriesChange = (value: string) => {
    updateFormData({
      series_id: value === "none" ? "" : value,
      // Reset position if series is cleared
      series_position: value === "none" ? "" : formData.series_position,
    });
  };

  // Validate form before submission
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.slug.trim()) {
      errors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug =
        "Slug must contain only lowercase letters, numbers, and hyphens";
    }

    if (!formData.excerpt.trim()) {
      errors.excerpt = "Excerpt is required";
    }

    if (!formData.content.trim()) {
      errors.content = "Content is required";
    }

    if (selectedCategory_ids.length === 0) {
      errors.category_ids = "At least one category is required";
    }

    if (formData.series_id && !formData.series_position) {
      errors.series_position = "Position is required when part of a series";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      // If there are validation errors on the content tab, switch to it
      if (
        validationErrors.title ||
        validationErrors.content ||
        validationErrors.excerpt
      ) {
        setActiveTab("content");
      } else {
        setActiveTab("metadata");
      }
      return;
    }

    // Auto-calculate reading time if not provided
    if (!formData.reading_time) {
      formData.reading_time = calculateReading_time(formData.content);
    }

    // Clean up optional fields
    if (formData.series_id === "none" || formData.series_id === "") {
      formData.series_id = "";
      formData.series_position = "";
    }

    if (formData.recommended_next_read_id === "none") {
      formData.recommended_next_read_id = "";
    }

    // Submit the form
    try {
      await onSubmit(
        {
          ...formData,
          category_ids: selectedCategory_ids,
          tag_ids: selectedTag_ids,
          technology_ids: selectedTechnology_ids,
          related_post_ids: selectedRelatedPosts,
          series_position: formData.series_position
            ? parseInt(formData.series_position)
            : undefined,
        },
        cover_imageFile || undefined,
      );
    } catch (error) {
      console.error("Error submitting blog:", error);
    }
  };

  // Function to move to next tab
  const handleNextTab = () => {
    if (activeTab === "content") {
      setActiveTab("metadata");
    }
  };

  // Function to move to previous tab
  const handlePrevTab = () => {
    if (activeTab === "metadata") {
      setActiveTab("content");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  return (
    <Card
      className="flex flex-col overflow-y-auto "
      style={{ maxHeight: "calc(100vh - 160px)" }}
    >
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      {/* Tabs with Action Buttons in the header */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col h-full"
      >
        <div className="border-b px-4 flex justify-between items-center">
          {/* Tab triggers inside TabsList */}
          <TabsList className="h-12">
            <TabsTrigger
              value="content"
              className="flex-1 data-[state=active]:bg-transparent"
            >
              1. Content
            </TabsTrigger>
            <TabsTrigger
              value="metadata"
              className="flex-1 data-[state=active]:bg-transparent"
            >
              2. Metadata & Publishing
            </TabsTrigger>
          </TabsList>

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              size="sm"
            >
              Cancel
            </Button>

            {activeTab === "content" ? (
              <Button onClick={handleNextTab} size="sm" variant="secondary">
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button onClick={handlePrevTab} size="sm" variant="outline">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="sm"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : formData.status === "published" ? (
                    <>
                      <FileUp className="mr-2 h-4 w-4" />
                      Publish
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content Tab */}
        <TabsContent
          value="content"
          className="flex-grow flex flex-col m-0 overflow-hidden"
        >
          <div className="p-6 overflow-y-auto flex-grow">
            {/* Title */}
            <div className="space-y-2 mb-6">
              <Label
                htmlFor="title"
                className={validationErrors.title ? "text-destructive" : ""}
              >
                Post Title*
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={`text-xl font-medium ${validationErrors.title ? "border-destructive" : ""}`}
                placeholder="Enter post title"
              />
              {validationErrors.title && (
                <p className="text-sm text-destructive">
                  {validationErrors.title}
                </p>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2 mb-6">
              <Label
                htmlFor="content"
                className={validationErrors.content ? "text-destructive" : ""}
              >
                Content*
              </Label>
              <EnhancedMarkdownEditor
                value={formData.content}
                onChange={(content) => updateFormData({ content })}
                placeholder="Write your blog post content here..."
                className="min-h-[30vh]"
              />
              {validationErrors.content && (
                <p className="text-sm text-destructive">
                  {validationErrors.content}
                </p>
              )}
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <Label
                htmlFor="excerpt"
                className={validationErrors.excerpt ? "text-destructive" : ""}
              >
                Excerpt*{" "}
                <span className="text-xs text-muted-foreground">
                  (A brief summary of the post)
                </span>
              </Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => updateFormData({ excerpt: e.target.value })}
                placeholder="Brief summary of the post"
                rows={3}
                className={validationErrors.excerpt ? "border-destructive" : ""}
              />
              {validationErrors.excerpt && (
                <p className="text-sm text-destructive">
                  {validationErrors.excerpt}
                </p>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Metadata Tab */}
        <TabsContent
          value="metadata"
          className="flex-grow flex flex-col m-0 overflow-hidden"
        >
          <div className="p-6 overflow-y-auto flex-grow">
            {/* Metadata content - no changes here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-6">
                {/* Category_ids */}
                <div className="space-y-2">
                  <Label
                    className={
                      validationErrors.category_ids ? "text-destructive" : ""
                    }
                  >
                    Category_ids*
                  </Label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {category_ids.map((category) => (
                      <Badge
                        key={category.id}
                        variant={
                          selectedCategory_ids.includes(category.id)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer py-1"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                  {validationErrors.category_ids && (
                    <p className="text-sm text-destructive">
                      {validationErrors.category_ids}
                    </p>
                  )}
                </div>

                {/* Tag_ids */}
                <div className="space-y-2">
                  <Label htmlFor="tag_ids">Tags (Optional)</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedTag_ids.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="pl-2 pr-1 py-1 gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:bg-primary-foreground rounded-full ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      placeholder="Enter tag_ids and press Enter"
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddTag}
                      disabled={!tagInput.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                {/* Technology_ids */}
                <div className="space-y-2">
                  <Label>Technologies (Optional)</Label>
                  <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto border p-2 rounded-md">
                    {technology_ids.map((tech) => (
                      <Badge
                        key={tech.id}
                        variant={
                          selectedTechnology_ids.includes(tech.id)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer py-1"
                        onClick={() => toggleTechnology(tech.id)}
                      >
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Cover Image */}
                <div className="space-y-2">
                  <Label>Cover Image (Optional)</Label>
                  {previewUrl ? (
                    <div className="relative border rounded-md overflow-hidden h-40">
                      <Image
                        src={getImageSrc(previewUrl)}
                        alt="Cover image preview"
                        className="object-cover w-full h-full"
                        width={50}
                        height={50}
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
                      className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={handleSelectImage}
                    >
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload a cover image
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-6">
                {/* URL Slug */}
                <div className="space-y-2">
                  <Label
                    htmlFor="slug"
                    className={validationErrors.slug ? "text-destructive" : ""}
                  >
                    URL Slug*
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => updateFormData({ slug: e.target.value })}
                    className={
                      validationErrors.slug ? "border-destructive" : ""
                    }
                    placeholder="post-url-slug"
                  />
                  {validationErrors.slug ? (
                    <p className="text-sm text-destructive">
                      {validationErrors.slug}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      This will be used in the URL: /blog/your-slug
                    </p>
                  )}
                </div>

                {/* Publication Date */}
                <div className="space-y-2">
                  <Label htmlFor="date">Publication Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateFormData({ date: e.target.value })}
                  />
                </div>

                {/* Series */}
                <div className="space-y-2">
                  <Label htmlFor="series">Series (Optional)</Label>
                  <Select
                    value={formData.series_id || "none"}
                    onValueChange={handleSeriesChange}
                  >
                    <SelectTrigger id="series">
                      <SelectValue placeholder="Select series" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        None - Not part of a series
                      </SelectItem>
                      {series.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Series Position (only if series is selected) */}
                {formData.series_id && formData.series_id !== "none" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="series_position"
                      className={
                        validationErrors.series_position
                          ? "text-destructive"
                          : ""
                      }
                    >
                      Position in Series*
                    </Label>
                    <Input
                      id="series_position"
                      type="number"
                      min="1"
                      value={formData.series_position}
                      onChange={(e) =>
                        updateFormData({ series_position: e.target.value })
                      }
                      placeholder="Position number (e.g., 1, 2, 3)"
                      className={
                        validationErrors.series_position
                          ? "border-destructive"
                          : ""
                      }
                    />
                    {validationErrors.series_position && (
                      <p className="text-sm text-destructive">
                        {validationErrors.series_position}
                      </p>
                    )}
                  </div>
                )}

                {/* Publication Status */}
                <div className="space-y-2">
                  <Label>Publication Status</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`border rounded-md p-3 cursor-pointer ${formData.status === "draft" ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => updateFormData({ status: "draft" })}
                    >
                      <div className="font-medium">Draft</div>
                      <div className="text-xs text-muted-foreground">
                        Save but don&apos;t publish
                      </div>
                    </div>
                    <div
                      className={`border rounded-md p-3 cursor-pointer ${formData.status === "published" ? "border-primary bg-primary/5" : ""}`}
                      onClick={() => updateFormData({ status: "published" })}
                    >
                      <div className="font-medium">Published</div>
                      <div className="text-xs text-muted-foreground">
                        Visible to readers
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      updateFormData({ featured: !!checked })
                    }
                  />
                  <Label htmlFor="featured" className="cursor-pointer">
                    Feature this post (will appear in featured sections)
                  </Label>
                </div>

                {/* Read Count */}
                <div className="space-y-2">
                  <Label>Read Count</Label>
                  <p className="text-2xl font-bold">
                    {blog?.read_count || 0} views
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
