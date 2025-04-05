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
import { SkillType, CategoryType, TechnologyType } from "@/types/admin";
import { categoryService } from "@/services/categoryService";
import { technologyService } from "@/services/technologyService";

type SkillFormProps = {
  skill?: SkillType;
  onSubmit: (
    data: Omit<SkillType, "id" | "created_at" | "updated_at">,
  ) => Promise<void>;
  onCancel: () => void;
};

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

export function SkillForm({ skill, onSubmit, onCancel }: SkillFormProps) {
  const [formData, setFormData] = useState({
    name: skill?.name || "",
    category_id: skill?.category_id || "",
    technology_id: skill?.technology_id || "",
    level: skill?.level || "",
    years: skill?.years || 0,
  });

  const [domains, setDomains] = useState<CategoryType[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [domainsData, technologiesData] = await Promise.all([
          categoryService.getCategories(),
          technologyService.getTechnologies(),
        ]);
        setDomains(domainsData);
        setTechnologies(technologiesData);
      } catch (error) {
        console.error("Error loading form data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
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
        <Label htmlFor="name">Skill Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Domain</Label>
        <Select
          value={formData.category_id}
          onValueChange={(value) =>
            setFormData({ ...formData, category_id: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select domain" />
          </SelectTrigger>
          <SelectContent>
            {domains.map((domain) => (
              <SelectItem key={domain.id} value={domain.id}>
                {domain.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="technology">Technology</Label>
        <Select
          value={formData.technology_id}
          onValueChange={(value) =>
            setFormData({ ...formData, technology_id: value })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select technology" />
          </SelectTrigger>
          <SelectContent>
            {technologies.map((tech) => (
              <SelectItem key={tech.id} value={tech.id}>
                {tech.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <Select
            value={formData.level}
            onValueChange={(value) =>
              setFormData({ ...formData, level: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              {SKILL_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="years">Years</Label>
          <Input
            id="years"
            type="number"
            value={formData.years}
            onChange={(e) =>
              setFormData({ ...formData, years: Number(e.target.value) })
            }
            min="0"
            step="0.5"
            required
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{skill ? "Update" : "Create"} Skill</Button>
      </div>
    </form>
  );
}
