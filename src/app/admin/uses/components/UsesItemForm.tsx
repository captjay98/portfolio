import { useState, useEffect } from "react";
import { UsesItemType, CategoryType } from "../../../../types/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categoryService } from "@/services/categoryService";

interface UsesItemFormProps {
  item?: UsesItemType;
  onSubmit: (
    data: Omit<UsesItemType, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  onCancel: () => void;
}

// Special constant for "no category" option
const NO_CATEGORY = "no_category_selected";

export function UsesItemForm({ item, onSubmit, onCancel }: UsesItemFormProps) {
  const [formData, setFormData] = useState({
    name: item?.name || "",
    category_id: item?.category_id || "",
    description: item?.description || "",
    link: item?.link || "",
    image: item?.image || "",
    image_id: item?.image_id || "",
    is_favorite: item?.is_favorite ?? false,
    priority: item?.priority || 0,
  });
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [, setLoading] = useState(true);

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
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link (Optional)</Label>
        <Input
          id="link"
          name="link"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <p className="text-xs text-muted-foreground">
            Lower numbers appear first
          </p>
        </div>

        <div className="space-y-2 flex flex-col justify-end">
          <div className="flex items-center space-x-2">
            <Switch
              id="is_favorite"
              checked={formData.is_favorite}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_favorite: checked })
              }
            />
            <Label htmlFor="is_favorite">Mark as favorite</Label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Favorite items may be highlighted in the UI
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{item ? "Update" : "Create"} Technology</Button>
      </div>
    </form>
  );
}
