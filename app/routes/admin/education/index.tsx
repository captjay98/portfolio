import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, GraduationCap, Calendar, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { EducationType } from '@app/types/admin';
import { educationService } from '@app/services/educationService';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Label } from '@app/components/ui/label';
import { Textarea } from '@app/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

export const Route = createFileRoute('/admin/education/')({
  component: AdminEducation,
});

function AdminEducation() {
  const [educations, setEducations] = useState<EducationType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<EducationType | null>(null);

  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    is_current: false,
    priority: 0,
  });

  useEffect(() => {
    fetchEducation();
  }, []);

  async function fetchEducation() {
    try {
      setIsLoading(true);
      const data = await educationService.getEducation();
      setEducations(data);
    } catch (error) {
      console.error('Error fetching education:', error);
      toast.error('Failed to load education data');
    } finally {
      setIsLoading(false);
    }
  }

  const handleNew = () => {
    setEditingEdu(null);
    setFormData({
      degree: '',
      institution: '',
      location: '',
      start_date: '',
      end_date: '',
      description: '',
      is_current: false,
      priority: 0,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (edu: EducationType) => {
    setEditingEdu(edu);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location || '',
      start_date: edu.start_date,
      end_date: edu.end_date || '',
      description: edu.description || '',
      is_current: edu.is_current || false,
      priority: edu.priority || 0,
    });
    setIsFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!editingEdu) return;
    try {
      await educationService.deleteEducation(editingEdu.id);
      setEducations(educations.filter((e) => e.id !== editingEdu.id));
      toast.success('Education deleted');
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education');
    } finally {
      setIsDeleteDialogOpen(false);
      setEditingEdu(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEdu) {
        const updated = await educationService.updateEducation(editingEdu.id, formData);
        setEducations(educations.map((e) => (e.id === editingEdu.id ? updated : e)));
        toast.success('Education updated');
      } else {
        const created = await educationService.createEducation(formData);
        setEducations([...educations, created]);
        toast.success('Education added');
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error('Failed to save education');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 py-8">
        <div className="h-6 w-48 bg-light-subtle/10 dark:bg-[#131721] rounded animate-pulse" />
        <div className="h-64 w-full bg-white dark:bg-[#0a0e14] border border-light-border dark:border-[#1e2430] rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-light-border dark:border-[#1e2430]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-blue-500/10 dark:bg-blue-500/15 text-blue-800 dark:text-[#39bae6] border border-blue-500/20">
              ACADEMIC CREDENTIALS
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              {educations.length} Qualifications
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Education & Degrees
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            University degrees, programs, dates, and academic qualifications.
          </p>
        </div>

        <button
          onClick={handleNew}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#e6b450] hover:bg-[#d48b00] text-black font-mono text-xs font-semibold rounded-lg tracking-wider transition-colors shadow-xs w-full sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>ADD EDUCATION</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50">
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Degree / Certification</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Institution</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Location</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Timeline</TableHead>
                <TableHead className="text-right text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {educations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No education records found
                  </TableCell>
                </TableRow>
              ) : (
                educations.map((edu) => (
                  <TableRow key={edu.id}>
                    <TableCell className="font-semibold">{edu.degree}</TableCell>
                    <TableCell>{edu.institution}</TableCell>
                    <TableCell>{edu.location || '-'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {edu.start_date} - {edu.is_current ? 'Present' : edu.end_date || 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(edu)}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingEdu(edu);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-destructive"
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

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{editingEdu ? 'Edit Education' : 'Add Education'}</DialogTitle>
            <DialogDescription>
              {editingEdu ? 'Update your degree or institution details.' : 'Add school or degree to portfolio.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree / Program</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. B.Sc. Computer Science"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="institution">Institution / University</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g. Ahmadu Bello University"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  placeholder="2016"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  placeholder="2021 (or Present)"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Kaduna, Nigeria"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingEdu ? 'Update' : 'Create'} Education
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Education</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {editingEdu?.degree} at {editingEdu?.institution}?
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
