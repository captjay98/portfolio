import { useState } from "react";
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
import { CategoryType } from "@/types/admin";

type CategoryFormProps = {
  category?: CategoryType;
  categories: CategoryType[];
  onSubmit: (
    data: Omit<CategoryType, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  onCancel: () => void;
};

// Special constant for "no parent" option
const NO_PARENT = "no_parent_selected";

export function CategoryForm({
  category,
  categories,
  onSubmit,
  onCancel,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    parent_id: category?.parent_id || undefined,
  });

  // List of potential parent categories (excluding self)
  const potentialParents = categories.filter((cat) => cat.id !== category?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Frontend, React, JavaScript"
          required
        />
      </div>

      {/* Parent Category Field  */}
      {potentialParents.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="parent">Parent Category (Optional)</Label>
          <Select
            value={formData.parent_id || NO_PARENT}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                parent_id: value === NO_PARENT ? undefined : value,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="None (Top Level)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NO_PARENT}>None (Top Level)</SelectItem>
              {potentialParents.map((parent) => (
                <SelectItem key={parent.id} value={parent.id}>
                  {parent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Description Field */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Brief description of this category"
          rows={3}
        />
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{category ? "Update" : "Create"} Category</Button>
      </div>
    </form>
  );
}
