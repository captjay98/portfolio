import { useState, useEffect, useRef } from 'react';
import { Loader2, X, Image as ImageIcon, Save } from 'lucide-react';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import { Card } from '@app/components/ui/card';
import { Badge } from '@app/components/ui/badge';
import { Checkbox } from '@app/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@app/components/ui/select';
import {
  BlogPostType,
  BlogSeriesType,
  CategoryType,
  TechnologyType,
} from '@app/types/admin';
import { categoryService } from '@app/services/categoryService';
import { technologyService } from '@app/services/technologyService';
import { blogService } from '@app/services/blogService';
import { MarkdownRenderer } from '@app/components/markdown-renderer';
import { getImageSrc } from '@app/utils/imageUtils';

interface BlogFormProps {
  blog?: BlogPostType;
  isSubmitting?: boolean;
  onSubmit: (
    data: Omit<BlogPostType, 'id' | 'created_at' | 'updated_at'>,
    coverImageFile?: File,
  ) => Promise<void>;
  onCancel: () => void;
}

const NO_SERIES = 'no_series_selected';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 225;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

export function BlogForm({ blog, isSubmitting, onSubmit, onCancel }: BlogFormProps) {
  const [activeTab, setActiveTab] = useState('content');

  const [formData, setFormData] = useState({
    title: blog?.title || '',
    slug: blog?.slug || '',
    excerpt: blog?.excerpt || '',
    content: blog?.content || '',
    cover_image: blog?.cover_image || '',
    cover_image_id: blog?.cover_image_id || '',
    date: blog?.date || new Date().toISOString().split('T')[0],
    status: blog?.status || 'draft',
    featured: blog?.featured || false,
    series_id: blog?.series_id || '',
  });

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    blog?.category_ids || [],
  );
  const [selectedTechnologyIds, setSelectedTechnologyIds] = useState<string[]>(
    blog?.technology_ids || [],
  );

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyType[]>([]);
  const [series, setSeries] = useState<BlogSeriesType[]>([]);
  const [loading, setLoading] = useState(true);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(blog?.cover_image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, technologiesData, seriesData] = await Promise.all([
          categoryService.getCategories(),
          technologyService.getTechnologies(),
          blogService.getAllSeries(),
        ]);
        setCategories(categoriesData);
        setTechnologies(technologiesData);
        setSeries(seriesData);
      } catch (error) {
        console.error('Error loading blog form data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: !prev.slug || prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setValidationErrors((prev) => ({ ...prev, cover_image: 'Image size must be less than 5MB' }));
      return;
    }
    setValidationErrors((prev) => {
      const next = { ...prev };
      delete next.cover_image;
      return next;
    });
    setCoverImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSelectImage = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setCoverImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    updateFormData({ cover_image: '', cover_image_id: '' });
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    );
  };

  const toggleTechnology = (techId: string) => {
    setSelectedTechnologyIds((prev) =>
      prev.includes(techId) ? prev.filter((id) => id !== techId) : [...prev, techId],
    );
  };

  const handleSeriesChange = (value: string) => {
    updateFormData({ series_id: value === NO_SERIES ? '' : value });
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.slug.trim()) {
      errors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'Slug must contain only lowercase letters, numbers, and hyphens';
    }
    if (!formData.excerpt.trim()) errors.excerpt = 'Excerpt is required';
    if (!formData.content.trim()) errors.content = 'Content is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateForm()) {
      if (validationErrors.title || validationErrors.excerpt || validationErrors.content) {
        setActiveTab('content');
      } else {
        setActiveTab('meta');
      }
      return;
    }

    try {
      await onSubmit(
        {
          title: formData.title,
          slug: formData.slug,
          excerpt: formData.excerpt,
          content: formData.content,
          cover_image: formData.cover_image,
          cover_image_id: formData.cover_image_id || undefined,
          date: formData.date,
          reading_time: blog?.reading_time || calculateReadingTime(formData.content),
          category_ids: selectedCategoryIds,
          tag_ids: blog?.tag_ids || [],
          technology_ids: selectedTechnologyIds,
          status: formData.status as 'draft' | 'published',
          featured: formData.featured,
          series_id: formData.series_id || undefined,
          series_position: blog?.series_position,
          related_post_ids: blog?.related_post_ids || [],
        },
        coverImageFile || undefined,
      );
    } catch (error) {
      console.error('Error submitting blog:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading form data...</span>
      </div>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col">
        <div className="border-b px-4 py-2 flex justify-between items-center flex-wrap gap-2">
          <TabsList>
            <TabsTrigger value="content">1. Content</TabsTrigger>
            <TabsTrigger value="preview">2. Preview</TabsTrigger>
            <TabsTrigger value="meta">3. Meta &amp; Publishing</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting} size="sm">
              Cancel
            </Button>
            <Button type="button" onClick={() => handleSubmit()} disabled={isSubmitting} size="sm">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {formData.status === 'published' ? 'Publish' : 'Save Draft'}
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content tab */}
        <TabsContent value="content" className="p-6 space-y-6 m-0">
          <div className="space-y-2">
            <Label htmlFor="title" className={validationErrors.title ? 'text-destructive' : ''}>
              Post Title*
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={`text-xl font-medium ${validationErrors.title ? 'border-destructive' : ''}`}
              placeholder="Enter post title"
            />
            {validationErrors.title && <p className="text-sm text-destructive">{validationErrors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className={validationErrors.slug ? 'text-destructive' : ''}>
              URL Slug*
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => updateFormData({ slug: e.target.value })}
              className={validationErrors.slug ? 'border-destructive' : ''}
              placeholder="post-url-slug"
            />
            {validationErrors.slug ? (
              <p className="text-sm text-destructive">{validationErrors.slug}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Used in the public URL: /blog/your-slug</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className={validationErrors.excerpt ? 'text-destructive' : ''}>
              Excerpt*
            </Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => updateFormData({ excerpt: e.target.value })}
              placeholder="Brief summary of the post"
              rows={3}
              className={validationErrors.excerpt ? 'border-destructive' : ''}
            />
            {validationErrors.excerpt && <p className="text-sm text-destructive">{validationErrors.excerpt}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className={validationErrors.content ? 'text-destructive' : ''}>
              Content* <span className="text-xs text-muted-foreground">(Markdown supported)</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => updateFormData({ content: e.target.value })}
              placeholder="Write your blog post content here..."
              rows={16}
              className={`font-mono text-sm min-h-[30vh] ${validationErrors.content ? 'border-destructive' : ''}`}
            />
            {validationErrors.content && <p className="text-sm text-destructive">{validationErrors.content}</p>}
          </div>

          <div className="space-y-2">
            <Label>Cover Image (Optional)</Label>
            {previewUrl ? (
              <div className="relative border rounded-md overflow-hidden h-40">
                <img
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
                className="border border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={handleSelectImage}
              >
                <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload a cover image</p>
              </div>
            )}
            {validationErrors.cover_image && (
              <p className="text-sm text-destructive">{validationErrors.cover_image}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Publication Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => updateFormData({ date: e.target.value })}
            />
          </div>
        </TabsContent>

        {/* Preview tab */}
        <TabsContent value="preview" className="p-6 m-0">
          {formData.content.trim() ? (
            <div className="max-w-3xl">
              <MarkdownRenderer content={formData.content} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nothing to preview yet — write some content in the Content tab first.
            </p>
          )}
        </TabsContent>

        {/* Meta tab */}
        <TabsContent value="meta" className="p-6 space-y-6 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Categories*</Label>
                <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto border p-2 rounded-md">
                  {categories.map((category) => (
                    <Badge
                      key={category.id}
                      variant={selectedCategoryIds.includes(category.id) ? 'default' : 'outline'}
                      className="cursor-pointer py-1"
                      onClick={() => toggleCategory(category.id)}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </div>
                {validationErrors.category_ids && (
                  <p className="text-sm text-destructive">{validationErrors.category_ids}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Technologies (Optional)</Label>
                <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto border p-2 rounded-md">
                  {technologies.map((tech) => (
                    <Badge
                      key={tech.id}
                      variant={selectedTechnologyIds.includes(tech.id) ? 'default' : 'outline'}
                      className="cursor-pointer py-1"
                      onClick={() => toggleTechnology(tech.id)}
                    >
                      {tech.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Publication Status</Label>
                <Select value={formData.status} onValueChange={(v) => updateFormData({ status: v as 'draft' | 'published' })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft — save but don&apos;t publish</SelectItem>
                    <SelectItem value="published">Published — visible to readers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Series (Optional)</Label>
                <Select value={formData.series_id || NO_SERIES} onValueChange={handleSeriesChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_SERIES}>None — not part of a series</SelectItem>
                    {series.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => updateFormData({ featured: checked === true })}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Feature this post (appears in featured sections)
                </Label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
