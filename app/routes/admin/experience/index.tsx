import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  ExperienceType,
  CategoryType,
  TechnologyType,
  ExperienceAccomplishmentType,
} from '@app/types/admin';
import { ExperienceForm } from '@app/components/admin/ExperienceForm';

// Import Shadcn components
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
import { categoryService } from '@app/services/categoryService';
import { technologyService } from '@app/services/technologyService';
import { experienceService } from '@app/services/experienceService';
import { experienceAccomplishmentService } from '@app/services/experienceAccomplishmentService';

export const Route = createFileRoute('/admin/experience/')({
  component: AdminExperience,
});

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'Present';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
};

function AdminExperience() {
  const [experiences, setExperiences] = useState<ExperienceType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingExperience, setEditingExperience] = useState<ExperienceType | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [experiencesData] = await Promise.all([
          experienceService.getExperiences(),
          categoryService.getCategories(),
          technologyService.getTechnologies(),
        ]);
        setExperiences(experiencesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Something went wrong fetching data');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredExperiences = experiences.filter((exp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      exp.title.toLowerCase().includes(searchLower) ||
      exp.company.toLowerCase().includes(searchLower) ||
      (exp.description && exp.description.toLowerCase().includes(searchLower))
    );
  });

  const handleEditExperience = (experience: ExperienceType) => {
    setEditingExperience(experience);
    setIsExperienceFormOpen(true);
  };

  const handleNewExperience = () => {
    setEditingExperience(null);
    setIsExperienceFormOpen(true);
  };

  const handleDelete = (experience: ExperienceType) => {
    setEditingExperience(experience);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingExperience) return;

    try {
      await experienceAccomplishmentService.deleteAccomplishmentsForExperience(editingExperience.id);
      await experienceService.deleteExperience(editingExperience.id);
      setExperiences(experiences.filter((exp) => exp.id !== editingExperience.id));
      toast.success('Experience deleted successfully');
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast.error('Failed to delete experience');
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingExperience(null);
    }
  };

  const handleExperienceFormSubmit = async (
    data: Omit<ExperienceType, 'id' | 'created_at' | 'updated_at'>,
    accomplishments: Omit<ExperienceAccomplishmentType, 'id' | 'experience_id' | 'created_at' | 'updated_at'>[],
  ) => {
    try {
      if (editingExperience) {
        const updatedExperience = await experienceService.updateExperience(editingExperience.id, data);
        await experienceAccomplishmentService.deleteAccomplishmentsForExperience(editingExperience.id);

        for (const accomplishment of accomplishments) {
          await experienceAccomplishmentService.createAccomplishment({
            experience_id: editingExperience.id,
            text: accomplishment.text,
            order: accomplishment.order,
          });
        }

        setExperiences(experiences.map((exp) => (exp.id === editingExperience.id ? { ...exp, ...updatedExperience } : exp)));
        toast.success('Experience updated successfully');
        setIsExperienceFormOpen(false);
      } else {
        const newExperience = await experienceService.createExperience(data);
        for (const accomplishment of accomplishments) {
          await experienceAccomplishmentService.createAccomplishment({
            experience_id: newExperience.id,
            text: accomplishment.text,
            order: accomplishment.order,
          });
        }
        setExperiences([...experiences, newExperience]);
        toast.success('Experience created successfully');
        setIsExperienceFormOpen(false);
      }
    } catch (error) {
      console.error('Error submitting experience form:', error);
      toast.error(`Failed to ${editingExperience ? 'update' : 'create'} experience`);
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
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-blue-500/10 dark:bg-blue-500/15 text-blue-800 dark:text-blue-400 border border-blue-500/20">
              CAREER TIMELINE
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              {experiences.length} Positions
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Work Experience
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            Manage professional roles, career milestones, and engineering impact.
          </p>
        </div>

        <button
          type="button"
          onClick={handleNewExperience}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#e6b450] hover:bg-[#d48b00] text-black font-mono text-xs font-semibold rounded-lg tracking-wider transition-colors shadow-xs w-full sm:w-auto shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>NEW EXPERIENCE</span>
        </button>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-light-subtle dark:text-[#8a9199]" />
        <Input
          type="search"
          placeholder="Search experience..."
          className="pl-8 text-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr className="border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50">
                <TableHead className="w-[200px] text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Position</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Company</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Location</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Timeline</TableHead>
                <TableHead className="text-right text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Actions</TableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {filteredExperiences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-xs font-mono">
                    No experience entries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredExperiences.map((exp) => (
                  <TableRow key={exp.id} className="hover:bg-light-subtle/5 dark:hover:bg-[#131721]/50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium text-xs text-light-text dark:text-[#bfbdb6]">{exp.title}</div>
                        <div className="text-[11px] text-light-subtle dark:text-[#8a9199] line-clamp-1">
                          {exp.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-light-text dark:text-[#bfbdb6]">{exp.company}</TableCell>
                    <TableCell className="text-xs text-light-subtle dark:text-[#8a9199]">{exp.location}</TableCell>
                    <TableCell className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
                      {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditExperience(exp)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(exp)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

      <Dialog open={isExperienceFormOpen} onOpenChange={setIsExperienceFormOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingExperience ? 'Edit Experience' : 'New Experience'}
            </DialogTitle>
            <DialogDescription>
              {editingExperience
                ? 'Update the details of this work experience.'
                : 'Add a new work experience to your portfolio.'}
            </DialogDescription>
          </DialogHeader>

          <ExperienceForm
            experience={editingExperience || undefined}
            onSubmit={handleExperienceFormSubmit}
            onCancel={() => setIsExperienceFormOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Experience</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingExperience?.title} at{' '}
              {editingExperience?.company}? This action cannot be undone.
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
