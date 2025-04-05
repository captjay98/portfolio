/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { CurrentTechStackType } from "../../../../types/admin";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TechStackFormProps {
  techStack?: CurrentTechStackType;
  categories: any[];
  technologies: any[];
  onSubmit: (
    data: Omit<CurrentTechStackType, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  onCancel: () => void;
}

export function TechStackForm({
  techStack,
  categories,
  technologies,
  onSubmit,
  onCancel,
}: TechStackFormProps) {
  const [formData, setFormData] = useState({
    name: techStack?.name || "",
    category_id: techStack?.category_id || "",
    technology_ids: techStack?.technology_ids || [],
    priority: techStack?.priority || 0,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (categoryId: string) => {
    setFormData({ ...formData, category_id: categoryId });
  };

  const handleTechnologySelect = (techId: string) => {
    if (!formData.technology_ids.includes(techId)) {
      setFormData({
        ...formData,
        technology_ids: [...formData.technology_ids, techId],
      });
    }
    setSearchTerm("");
  };

  const handleTechnologyRemove = (techId: string) => {
    setFormData({
      ...formData,
      technology_ids: formData.technology_ids.filter((id) => id !== techId),
    });
  };

  const filteredTechnologies = technologies.filter(
    (tech) =>
      !formData.technology_ids.includes(tech.id) &&
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedTechnologies = technologies.filter((tech) =>
    formData.technology_ids.includes(tech.id),
  );

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
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., Frontend Development, Backend Stack"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category_id}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Technologies</Label>
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedTechnologies.map((tech) => (
            <Badge key={tech.id} variant="secondary" className="text-sm py-1">
              {tech.name}
              <button
                type="button"
                onClick={() => handleTechnologyRemove(tech.id)}
                className="ml-1"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Search technologies..."
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No technologies found.</CommandEmpty>
            <CommandGroup>
              {filteredTechnologies.map((tech) => (
                <CommandItem
                  key={tech.id}
                  value={tech.name}
                  onSelect={() => handleTechnologySelect(tech.id)}
                >
                  {tech.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
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

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : techStack ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
