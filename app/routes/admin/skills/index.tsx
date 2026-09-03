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
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 w-full bg-muted/30 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
        <Button onClick={handleNewSkill}>
          <Plus className="mr-2 h-4 w-4" />
          New Skill
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search skills..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedDomain === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedDomain('all')}
          >
            All
          </Badge>
          {domains.map((domain) => (
            <Badge
              key={domain.id}
              variant={selectedDomain === domain.id ? 'default' : 'outline'}
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
                <TableHead>Skill Name</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead>Technology</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Years</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSkills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No skills found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSkills.map((skill) => (
                  <TableRow key={skill.id}>
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell>{getDomainName(skill.category_id)}</TableCell>
                    <TableCell>{getTechName(skill.technology_id)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{skill.level}</Badge>
                    </TableCell>
                    <TableCell>{skill.years} yrs</TableCell>
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
        </CardContent>
      </Card>

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
