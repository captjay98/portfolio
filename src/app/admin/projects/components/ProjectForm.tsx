import { useState, useEffect, useRef } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  ProjectType,
  CategoryType,
  TechnologyType,
} from "../../../../types/admin";
import { categoryService } from "@/services/categoryService";
import { technologyService } from "@/services/technologyService";
import { projectService } from "@/services/projectService";
import Image from "next/image";

type ProjectFormProps = {
  project?: ProjectType;
  onSubmit: (
    data: Omit<ProjectType, "id" | "created_at" | "updated_at">,
    imageFile?: File,
  ) => Promise<void>;
  onCancel: () => void;
};

export function ProjectForm({ project, onSubmit, onCancel }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    name: project?.name || "",
    description: project?.description || "",
    long_description: project?.long_description || "",
    image: project?.image || "",
    image_id: project?.image_id || project?.image || "",
    category_ids: [], // This will be managed separately as an array
    github: project?.github || "",
    live: project?.live || "",
    featured: project?.featured || false,
  });

  // For managing selected technologies
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>(
    project?.technology_ids || [],
  );

  // For managing selected categories
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    Array.isArray(project?.category_ids)
      ? project?.category_ids
      : project?.category_ids
        ? [project.category_ids]
        : [],
  );

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  // For image upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      try {
        const [categoriesData, technologiesData] = await Promise.all([
          categoryService.getCategories(),
          technologyService.getTechnologies(),
        ]);
        setCategories(categoriesData);
        setTechnologies(technologiesData);

        // Set image preview if project has an image
        if (project?.image) {
          setPreviewUrl(projectService.getImageUrl(project.image));
        }
      } catch (error) {
        console.error("Error loading form data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [project?.image]);

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

      // Clear any previous validation errors
      const newErrors = { ...validationErrors };
      delete newErrors.image;
      setValidationErrors(newErrors);

      setImageFile(file);

      // Create a preview URL
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

  // Toggle technology selection
  const toggleTechnology = (techId: string) => {
    setSelectedTechnologies((prev) =>
      prev.includes(techId)
        ? prev.filter((id) => id !== techId)
        : [...prev, techId],
    );
  };

  // Toggle category selection
  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = "Project name is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Short description is required";
    }

    if (selectedCategories.length === 0) {
      errors.category = "At least one category is required";
    }

    if (formData.github && !/^https?:\/\//.test(formData.github)) {
      errors.github = "GitHub URL must start with http:// or https://";
    }

    if (formData.live && !/^https?:\/\//.test(formData.live)) {
      errors.live = "Live demo URL must start with http:// or https://";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Include selected technologies and categories in the submission
      await onSubmit(
        {
          ...formData,
          technology_ids: selectedTechnologies,
          category_ids: selectedCategories,
        },
        imageFile || undefined,
      );
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <span className="ml-2">Loading form data...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className={validationErrors.name ? "text-destructive" : ""}
        >
          Project Name*
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={validationErrors.name ? "border-destructive" : ""}
        />
        {validationErrors.name && (
          <p className="text-sm text-destructive">{validationErrors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="category"
          className={validationErrors.category ? "text-destructive" : ""}
        >
          Categories*
        </Label>
        <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto border p-2 rounded-md">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={
                selectedCategories.includes(category.id) ? "default" : "outline"
              }
              className="cursor-pointer py-1"
              onClick={() => toggleCategory(category.id)}
            >
              {category.name}
            </Badge>
          ))}
        </div>
        {validationErrors.category && (
          <p className="text-sm text-destructive">
            {validationErrors.category}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Selected: {selectedCategories.length} categories
        </p>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="description"
          className={validationErrors.description ? "text-destructive" : ""}
        >
          Short Description*
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={2}
          className={validationErrors.description ? "border-destructive" : ""}
        />
        {validationErrors.description ? (
          <p className="text-sm text-destructive">
            {validationErrors.description}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Brief description for project cards (max 1000 chars)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="longDescription">Long Description</Label>
        <Textarea
          id="longDescription"
          value={formData.long_description}
          onChange={(e) =>
            setFormData({ ...formData, long_description: e.target.value })
          }
          rows={8}
        />
        <p className="text-sm text-muted-foreground">
          Full description for the project details page, supports markdown
        </p>
      </div>

      <div className="space-y-2">
        <Label className={validationErrors.image ? "text-destructive" : ""}>
          Project Image
        </Label>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        {previewUrl ? (
          <div className="relative border rounded-md overflow-hidden h-40">
            <Image
              width={400}
              height={160}
              src={previewUrl}
              alt="Project preview"
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
              Click to upload an image
            </p>
          </div>
        )}
        {validationErrors.image && (
          <p className="text-sm text-destructive">{validationErrors.image}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Technologies</Label>
        <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto border p-2 rounded-md">
          {technologies.map((tech) => (
            <Badge
              key={tech.id}
              variant={
                selectedTechnologies.includes(tech.id) ? "default" : "outline"
              }
              className="cursor-pointer py-1"
              onClick={() => toggleTechnology(tech.id)}
            >
              {tech.name}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Selected: {selectedTechnologies.length} technologies
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="github"
            className={validationErrors.github ? "text-destructive" : ""}
          >
            GitHub URL
          </Label>
          <Input
            id="github"
            type="text"
            value={formData.github}
            onChange={(e) =>
              setFormData({ ...formData, github: e.target.value })
            }
            placeholder="https://github.com/username/repo"
            className={validationErrors.github ? "border-destructive" : ""}
          />
          {validationErrors.github && (
            <p className="text-sm text-destructive">
              {validationErrors.github}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="live"
            className={validationErrors.live ? "text-destructive" : ""}
          >
            Live Demo URL
          </Label>
          <Input
            id="live"
            type="text"
            value={formData.live}
            onChange={(e) => setFormData({ ...formData, live: e.target.value })}
            placeholder="https://yourproject.com"
            className={validationErrors.live ? "border-destructive" : ""}
          />
          {validationErrors.live && (
            <p className="text-sm text-destructive">{validationErrors.live}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="featured"
          checked={formData.featured}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, featured: checked === true })
          }
        />
        <Label htmlFor="featured">Featured project (shown on homepage)</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {project ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>{project ? "Update" : "Create"} Project</>
          )}
        </Button>
      </div>
    </form>
  );
}
