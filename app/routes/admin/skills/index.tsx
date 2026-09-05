import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { SkillType, CategoryType, TechnologyType } from '@app/types/admin';
import { SkillForm } from '@app/components/admin/SkillForm';

import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Card, CardContent } from '@app/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@app/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@app/components/ui/dialog';
import { Badge } from '@app/components/ui/badge';
import { categoryService } from '@app/services/categoryService';
import { skillService } from '@app/services/skillService';
import { technologyService } from '@app/services/technologyService';

export const Route = createFileRoute('/admin/skills/')({
  component: AdminSkills,
});

function AdminSkills() {
  const [skills, setSkills] = useState<SkillType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [editingSkill, setEditingSkill] = useState<SkillType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [domains, setDomains] = useState<CategoryType[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyType[]>([]);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [skillsData, categoriesData, technologiesData] = await Promise.all([
          skillService.getSkills(),
          categoryService.getCategories(),
          technologyService.getTechnologies(),
        ]);
        setSkills(skillsData);
        setDomains(categoriesData);
        setTechnologies(technologiesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Something went wrong fetching data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const getDomainName = (domainId: string): string => {
    const domain = domains.find((d) => d.id === domainId);
    return domain?.name || 'Unknown';
  };

  const getTechName = (techId?: string): string => {
    if (!techId) return '-';
    const tech = technologies.find((t) => t.id === techId);
    return tech?.name || '-';
  };

  const filteredSkills = skills.filter((skill) => {
    if (selectedDomain !== 'all' && skill.category_id !== selectedDomain) {
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
      await skillService.deleteSkill(editingSkill.id);
      setSkills(skills.filter((s) => s.id !== editingSkill.id));
      toast.success('Skill deleted successfully');
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast.error('Failed to delete skill');
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingSkill(null);
    }
  };

  const handleSkillFormSubmit = async (
    data: Omit<SkillType, 'id' | 'created_at' | 'updated_at'>,
  ) => {
    try {
      if (editingSkill) {
        const updatedSkill = await skillService.updateSkill(editingSkill.id, data);
        setSkills(skills.map((s) => (s.id === editingSkill.id ? updatedSkill : s)));
        toast.success('Skill updated successfully');
      } else {
        const newSkill = await skillService.createSkill(data);
        setSkills([...skills, newSkill]);
        toast.success('Skill created successfully');
      }
      setIsSkillFormOpen(false);
    } catch (error) {
      console.error('Error submitting skill form:', error);
      toast.error(`Failed to ${editingSkill ? 'update' : 'create'} skill`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 py-4 sm:py-8">
        <div className="h-6 w-48 bg-light-subtle/10 dark:bg-[#131721] rounded animate-pulse" />
        <div className="h-64 w-full bg-white dark:bg-[#0a0e14] border border-light-border dark:border-[#1e2430] rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-light-border dark:border-[#1e2430]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/10 dark:bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] border border-amber-500/20">
              CAPABILITIES &amp; PROFICIENCIES
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              {skills.length} Skills
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Skills &amp; Competencies
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            Catalog technical proficiencies, domain mastery, and practical experience.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewSkill}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#e6b450] hover:bg-[#d48b00] text-black font-mono text-xs font-semibold rounded-lg tracking-wider transition-colors shadow-xs w-full sm:w-auto shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>NEW SKILL</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-light-subtle dark:text-[#8a9199]" />
          <Input
            type="search"
            placeholder="Search skills..."
            className="pl-8 text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Badge
            variant={selectedDomain === 'all' ? 'default' : 'outline'}
            className="cursor-pointer text-xs"
            onClick={() => setSelectedDomain('all')}
          >
            All
          </Badge>
          {domains.map((domain) => (
            <Badge
              key={domain.id}
              variant={selectedDomain === domain.id ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => setSelectedDomain(domain.id)}
            >
              {domain.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr className="border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50">
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Skill Name</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Domain</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Technology</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Level</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Years</TableHead>
                <TableHead className="text-right text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredSkills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-xs font-mono">
                    No skills found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSkills.map((skill) => (
                  <TableRow key={skill.id} className="hover:bg-light-subtle/5 dark:hover:bg-[#131721]/50 transition-colors">
                    <TableCell className="font-medium text-xs text-light-text dark:text-[#bfbdb6]">{skill.name}</TableCell>
                    <TableCell className="text-xs text-light-subtle dark:text-[#8a9199]">{getDomainName(skill.category_id)}</TableCell>
                    <TableCell className="text-xs text-light-subtle dark:text-[#8a9199]">{getTechName(skill.technology_id)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] font-mono">{skill.level}</Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">{skill.years} yrs</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditSkill(skill)}>
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
        </div>
      </div>

      <Dialog open={isSkillFormOpen} onOpenChange={setIsSkillFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingSkill ? 'Edit Skill' : 'New Skill'}</DialogTitle>
            <DialogDescription>
              {editingSkill ? 'Update the details of this skill.' : 'Add a new skill to your portfolio.'}
            </DialogDescription>
          </DialogHeader>

          <SkillForm
            skill={editingSkill || undefined}
            onSubmit={handleSkillFormSubmit}
            onCancel={() => setIsSkillFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Skill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingSkill?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
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
