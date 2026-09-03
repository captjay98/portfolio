import { useState, useEffect } from "react";
import { UsesItemType, CategoryType } from "@app/types/admin";
import { Button } from "@app/components/ui/button";
import { Input } from "@app/components/ui/input";
import { Label } from "@app/components/ui/label";
import { Textarea } from "@app/components/ui/textarea";
import { Switch } from "@app/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@app/components/ui/select";
import { categoryService } from "@app/services/categoryService";

interface UsesItemFormProps {
  item?: UsesItemType;
  onSubmit: (
    data: Omit<UsesItemType, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  onCancel: () => void;
}

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
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoryService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

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
        <Label htmlFor="name">Item Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., MacBook Pro, VS Code, Arc Browser"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category_id || NO_CATEGORY}
          onValueChange={(val) =>
            setFormData({ ...formData, category_id: val === NO_CATEGORY ? "" : val })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link / Product URL</Label>
        <Input
          id="link"
          type="url"
          value={formData.link || ""}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          placeholder="Why do you use this?"
          required
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="is_favorite"
          checked={formData.is_favorite}
          onCheckedChange={(checked) => setFormData({ ...formData, is_favorite: checked })}
        />
        <Label htmlFor="is_favorite">Mark as Favorite</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {item ? "Update" : "Create"} Item
        </Button>
      </div>
    </form>
  );
}
