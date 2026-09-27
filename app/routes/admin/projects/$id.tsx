import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { projectService } from '@app/services/projectService';
import { ProjectType } from '@app/types/admin';
import { ProjectForm } from '@app/components/admin/ProjectForm';

export const Route = createFileRoute('/admin/projects/$id')({
  component: AdminEditProject,
});

function AdminEditProject() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      setIsLoading(true);
      try {
        const projectData = await projectService.getProject(id);
        if (!projectData) {
          toast.error('Project not found');
          navigate({ to: '/admin/projects' });
          return;
        }
        setProject(projectData);
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error('Failed to load project');
        navigate({ to: '/admin/projects' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleSubmit = async (
    data: Omit<ProjectType, 'id' | 'created_at' | 'updated_at'>,
    imageFile?: File,
  ) => {
    setIsSubmitting(true);
    try {
      await projectService.updateProject(id, data, imageFile);
      toast.success('Project updated successfully');
      navigate({ to: '/admin/projects' });
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project');
    } finally {
      setIsSubmitting(false);
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

  if (!project) {
    return (
      <div className="py-8 text-sm text-muted-foreground">Project not found.</div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-light-border dark:border-[#1e2430]">
        <span className="w-fit text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/10 dark:bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] border border-amber-500/20">
          PORTFOLIO
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
          Edit Project
        </h1>
        <p className="text-xs text-light-subtle dark:text-[#8a9199]">
          Update “{project.name}” and save your changes.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs p-4 sm:p-6">
        <ProjectForm
          project={project}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate({ to: '/admin/projects' })}
        />
      </div>
    </div>
  );
}
