import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TechnologyType, CategoryType } from "../../../../types/admin";
import { categoryService } from "@/services/categoryService";
import Image from "next/image";

type TechnologyFormProps = {
  technology?: TechnologyType;
  onSubmit: (
    data: Omit<TechnologyType, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  onCancel: () => void;
};

// Special constant for "no category" option
const NO_CATEGORY = "no_category_selected";

export function TechnologyForm({
  technology,
  onSubmit,
  onCancel,
}: TechnologyFormProps) {
  const [formData, setFormData] = useState({
    name: technology?.name || "",
    category_id: technology?.category_id || "",
    icon: technology?.icon || "",
    website: technology?.website || "",
  });

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Technology Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., React, Python, Docker"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category_id || NO_CATEGORY}
          onValueChange={(value) =>
            setFormData({
              ...formData,
              category_id: value === NO_CATEGORY ? "" : value,
            })
          }
          required
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.length > 0 ? (
              categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value={NO_CATEGORY} disabled>
                No categories available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {categories.length === 0 && (
          <p className="text-xs text-amber-500 mt-1">
            No categories found. Please create some first.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon URL (Optional)</Label>
        <Input
          id="icon"
          type="url"
          value={formData.icon}
          onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
          placeholder="https://example.com/icon.svg"
        />
        {formData.icon && (
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">Preview:</span>
            <Image
              width={32}
              height={32}
              src={formData.icon}
              alt="Icon preview"
              className="h-8 w-8 object-contain"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Official Website (Optional)</Label>
        <Input
          id="website"
          type="url"
          value={formData.website}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
          placeholder="https://reactjs.org"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {technology ? "Update" : "Create"} Technology
        </Button>
      </div>
    </form>
  );
}
