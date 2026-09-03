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
      <div className="p-6 space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="h-64 w-full bg-muted/30 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Work Experience</h2>
        <Button onClick={handleNewExperience}>
          <Plus className="mr-2 h-4 w-4" />
          New Experience
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search experience..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Position</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Timeline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExperiences.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No experience entries found
                  </TableCell>
                </TableRow>
              ) : (
                filteredExperiences.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{exp.title}</div>
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {exp.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{exp.company}</TableCell>
                    <TableCell>{exp.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        <span>
                          {formatDate(exp.start_date)} - {formatDate(exp.end_date)}
                        </span>
                      </div>
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
                          <DropdownMenuItem onClick={() => handleEditExperience(exp)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDelete(exp)}
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
