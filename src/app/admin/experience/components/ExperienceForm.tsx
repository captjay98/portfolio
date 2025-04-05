import { useState, useEffect } from "react";
import { X, Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ExperienceType,
  CategoryType,
  TechnologyType,
  ExperienceAccomplishmentType,
} from "../../../../types/admin";
import { categoryService } from "@/services/categoryService";
import { technologyService } from "@/services/technologyService";
import { experienceAccomplishmentService } from "@/services/experienceAccomplishmentService";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ExperienceFormProps = {
  experience?: ExperienceType;
  onSubmit: (
    data: Omit<ExperienceType, "id" | "created_at" | "updated_at">,
    accomplishments: Omit<
      ExperienceAccomplishmentType,
      "id" | "experience_id" | "created_at" | "updated_at"
    >[],
  ) => Promise<void>;
  onCancel: () => void;
};

export function ExperienceForm({
  experience,
  onSubmit,
  onCancel,
}: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    title: experience?.title || "",
    company: experience?.company || "",
    location: experience?.location || "",
    start_date: experience?.start_date || "",
    end_date: experience?.end_date || "",
    description: experience?.description || "",
    category_ids: experience?.category_ids || [],
    technology_ids: experience?.technology_ids || [],
  });

  // State for accomplishments
  const [accomplishments, setAccomplishments] = useState<
    { text: string; order: number; id?: string }[]
  >([{ text: "", order: 0 }]);

  const [domains, setDomains] = useState<CategoryType[]>([]);
  const [technology_ids, setTechnology_ids] = useState<TechnologyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentlyWorking, setCurrentlyWorking] = useState(
    !experience?.end_date,
  );

  // States for domain and technology selection
  const [selectedDomains, setSelectedDomains] = useState<string[]>(
    formData.category_ids,
  );
  const [selectedTechnology_ids, setSelectedTechnology_ids] = useState<
    string[]
  >(formData.technology_ids);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [domainsData, technology_idsData] = await Promise.all([
          categoryService.getCategories(),
          technologyService.getTechnologies(),
        ]);
        setDomains(domainsData);
        setTechnology_ids(technology_idsData);

        // Load accomplishments if editing an experience
        if (experience?.id) {
          const accomplishmentsData =
            await experienceAccomplishmentService.getAccomplishmentsByExperience(
              experience.id,
            );

          if (accomplishmentsData.length > 0) {
            setAccomplishments(
              accomplishmentsData.map((a) => ({
                id: a.id,
                text: a.text,
                order: a.order,
              })),
            );
          }
        }
      } catch (error) {
        console.error("Error loading form data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [experience?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Update form data with selected domains and technology_ids
    const updatedFormData = {
      ...formData,
      category_ids: selectedDomains,
      technology_ids: selectedTechnology_ids,
      end_date: currentlyWorking ? null : formData.end_date,
    };

    // Filter out empty accomplishments
    const filteredAccomplishments = accomplishments
      .filter((a) => a.text.trim() !== "")
      .map((a, index) => ({
        text: a.text,
        order: index,
      }));

    await onSubmit(updatedFormData, filteredAccomplishments);
  };

  // Toggle domain selection
  const toggleDomain = (domainId: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domainId)
        ? prev.filter((id) => id !== domainId)
        : [...prev, domainId],
    );
  };

  // Toggle technology selection
  const toggleTechnology = (techId: string) => {
    setSelectedTechnology_ids((prev) =>
      prev.includes(techId)
        ? prev.filter((id) => id !== techId)
        : [...prev, techId],
    );
  };

  // Handler for accomplishment changes
  const handleAccomplishmentChange = (index: number, text: string) => {
    const updatedAccomplishments = [...accomplishments];
    updatedAccomplishments[index].text = text;
    setAccomplishments(updatedAccomplishments);
  };

  // Add new accomplishment
  const addAccomplishment = () => {
    setAccomplishments([
      ...accomplishments,
      { text: "", order: accomplishments.length },
    ]);
  };

  // Remove accomplishment
  const removeAccomplishment = (index: number) => {
    if (accomplishments.length === 1) {
      // If it's the last one, just clear it
      setAccomplishments([{ text: "", order: 0 }]);
      return;
    }

    const updatedAccomplishments = accomplishments.filter(
      (_, i) => i !== index,
    );
    // Reorder the remaining accomplishments
    updatedAccomplishments.forEach((item, i) => {
      item.order = i;
    });
    setAccomplishments(updatedAccomplishments);
  };

  // Parse string date to Date object
  const parseDate = (
    dateString: string | null | undefined,
  ): Date | undefined => {
    if (!dateString) return undefined;
    // Try to parse YYYY-MM format
    const match = dateString.match(/^(\d{4})-(\d{2})$/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1; // JS months are 0-indexed
      return new Date(year, month, 1);
    }
    // Fallback to standard date parsing
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  };

  // Format Date object to YYYY-MM string format
  const formatDateToYearMonth = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, "yyyy-MM");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Position Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start_date"
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.start_date
                  ? format(
                      parseDate(formData.start_date) || new Date(),
                      "MMMM yyyy",
                    )
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                captionLayout="dropdown-buttons"
                selected={parseDate(formData.start_date)}
                onSelect={(date) =>
                  setFormData({
                    ...formData,
                    start_date: date ? formatDateToYearMonth(date) : "",
                  })
                }
                fromYear={1990}
                toYear={2030}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end_date"
                variant={"outline"}
                className="w-full justify-start text-left font-normal"
                disabled={currentlyWorking}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {currentlyWorking
                  ? "Present"
                  : formData.end_date
                    ? format(
                        parseDate(formData.end_date) || new Date(),
                        "MMMM yyyy",
                      )
                    : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                captionLayout="dropdown-buttons"
                selected={parseDate(formData.end_date)}
                onSelect={(date) =>
                  setFormData({
                    ...formData,
                    end_date: date ? formatDateToYearMonth(date) : "",
                  })
                }
                fromYear={1990}
                toYear={2030}
                disabled={currentlyWorking}
              />
            </PopoverContent>
          </Popover>
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={currentlyWorking}
              onChange={(e) => {
                setCurrentlyWorking(e.target.checked);
                if (e.target.checked) {
                  setFormData({ ...formData, end_date: "" });
                }
              }}
              className="h-4 w-4"
            />
            <Label htmlFor="currentlyWorking" className="cursor-pointer">
              I currently work here
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Domains</Label>
        <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto border p-2 rounded-md">
          {domains.map((domain) => (
            <Badge
              key={domain.id}
              variant={
                selectedDomains.includes(domain.id) ? "default" : "outline"
              }
              className="cursor-pointer py-1"
              onClick={() => toggleDomain(domain.id)}
            >
              {domain.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Technologies</Label>
        <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto border p-2 rounded-md">
          {technology_ids.map((tech) => (
            <Badge
              key={tech.id}
              variant={
                selectedTechnology_ids.includes(tech.id) ? "default" : "outline"
              }
              className="cursor-pointer py-1"
              onClick={() => toggleTechnology(tech.id)}
            >
              {tech.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          required
        />
      </div>

      {/* Accomplishments Section */}
      <div className="space-y-3 pt-3 border-t">
        <Label>Accomplishments</Label>

        <div className="space-y-3">
          {accomplishments.map((accomplishment, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={accomplishment.text}
                onChange={(e) =>
                  handleAccomplishmentChange(index, e.target.value)
                }
                placeholder={`Accomplishment ${index + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeAccomplishment(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAccomplishment}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Accomplishment
        </Button>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {experience ? "Update" : "Create"} Experience
        </Button>
      </div>
    </form>
  );
}
