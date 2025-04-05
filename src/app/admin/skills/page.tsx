"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, MoreHorizontal } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { SkillType, CategoryType, TechnologyType } from "@/types/admin";
import { SkillForm } from "./components/SkillForm";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { categoryService } from "@/services/categoryService";
import { skillService } from "@/services/skillService";
import { technologyService } from "@/services/technologyService";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function AdminSkills() {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("all");
  const [editingSkill, setEditingSkill] = useState<SkillType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [domains, setDomains] = useState<CategoryType[]>([]);
  const [, setTechnologies] = useState<TechnologyType[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Fetch all data directly using services
        const [skillsData, categoriesData, technologiesData] =
          await Promise.all([
            skillService.getSkills(),
            categoryService.getCategories(),
            technologyService.getTechnologies(),
          ]);

        setSkills(skillsData);
        // With our updated data model, we no longer filter by type
        setDomains(categoriesData);
        setTechnologies(technologiesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Something went wrong fetching data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Get domain name by ID
  const getDomainName = (domainId: string): string => {
    const domain = domains.find((d) => d.id === domainId);
    return domain?.name || "Unknown";
  };

  // Filter skills by domain and search term
  const filteredSkills = skills.filter((skill) => {
    if (selectedDomain !== "all" && skill.category_id !== selectedDomain) {
      return false;
    }

    const searchLower = searchTerm.toLowerCase();
    return skill.name.toLowerCase().includes(searchLower);
  });

  const handleEditSkill = (skill: SkillType) => {
    setEditingSkill(skill);
    setIsSkillFormOpen(true);
  };

  const handleNewSkill = () => {
    setEditingSkill(null);
    setIsSkillFormOpen(true);
  };

  const handleDelete = (skill: SkillType) => {
    setEditingSkill(skill);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingSkill) return;

    try {
      const toastId = toast.loading("Deleting skill...");

      // Use service directly instead of API route
      await skillService.deleteSkill(editingSkill.id);

      setSkills(skills.filter((skill) => skill.id !== editingSkill.id));
      toast.success("Skill deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingSkill(null);
    }
  };

  const handleSkillFormSubmit = async (
    data: Omit<SkillType, "id" | "created_at" | "updated_at">,
  ) => {
    const toastId = toast.loading(
      editingSkill ? "Updating skill..." : "Creating skill...",
    );

    try {
      if (editingSkill) {
        // Update existing skill - use service directly
        const updatedSkill = await skillService.updateSkill(
          editingSkill.id,
          data,
        );

        setSkills(
          skills.map((skill) =>
            skill.id === editingSkill.id ? updatedSkill : skill,
          ),
        );
        toast.success("Skill updated successfully", { id: toastId });
        setIsSkillFormOpen(false);
      } else {
        // Create new skill - use service directly
        const newSkill = await skillService.createSkill(data);

        setSkills([...skills, newSkill]);
        toast.success("Skill created successfully", { id: toastId });
        setIsSkillFormOpen(false);
      }
    } catch (error) {
      console.error("Error submitting skill form:", error);
      toast.error(`Failed to ${editingSkill ? "update" : "create"} skill`, {
        id: toastId,
      });
    }
  };

  // Get unique categories from skills
  const getUniqueSkillCategories = () => {
    const uniqueCategoryIds = new Set<string>();
    skills.forEach((skill) => {
      uniqueCategoryIds.add(skill.category_id);
    });
    return domains.filter((domain) => uniqueCategoryIds.has(domain.id));
  };

  // Main render code
  if (isLoading) {
    return (
      <TableSkeleton
        columns={5}
        rows={5}
        searchField={true}
        filterField={true}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Toast container for react-hot-toast */}
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
        <Button onClick={handleNewSkill}>
          <Plus className="mr-2 h-4 w-4" />
          New Skill
        </Button>
      </div>

      {/* Search field */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search skills..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Badge
            key="all"
            variant={selectedDomain === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedDomain("all")}
          >
            All Domains
          </Badge>
          {getUniqueSkillCategories().map((domain) => (
            <Badge
              key={domain.id}
              variant={selectedDomain === domain.id ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedDomain(domain.id)}
            >
              {domain.name}
            </Badge>
          ))}
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Skill</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Years</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSkills.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No skills found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSkills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getDomainName(skill.category_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <SkillLevelBadge level={skill.level} />
                    </TableCell>
                    <TableCell>
                      {skill.years} {skill.years === 1 ? "year" : "years"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleEditSkill(skill)}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(skill)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Skill Form Dialog */}
      <Dialog open={isSkillFormOpen} onOpenChange={setIsSkillFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSkill ? "Edit Skill" : "New Skill"}
            </DialogTitle>
            <DialogDescription>
              {editingSkill
                ? "Update the details of this skill."
                : "Add a new skill to your portfolio."}
            </DialogDescription>
          </DialogHeader>

          <SkillForm
            skill={editingSkill || undefined}
            onSubmit={handleSkillFormSubmit}
            onCancel={() => setIsSkillFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingSkill?.name}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SkillLevelBadge({ level }: { level: string }) {
  const badgeVariants: Record<
    string,
    { variant: "default" | "secondary" | "outline" | "destructive" }
  > = {
    Beginner: { variant: "outline" },
    Intermediate: { variant: "secondary" },
    Advanced: { variant: "default" },
    Expert: { variant: "destructive" },
  };

  return (
    <Badge variant={badgeVariants[level]?.variant || "default"}>{level}</Badge>
  );
}
