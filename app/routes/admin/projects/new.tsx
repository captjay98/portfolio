import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import { projectService } from '@app/services/projectService';
import { ProjectType } from '@app/types/admin';
import { ProjectForm } from '@app/components/admin/ProjectForm';

export const Route = createFileRoute('/admin/projects/new')({
  component: AdminNewProject,
});

function AdminNewProject() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    data: Omit<ProjectType, 'id' | 'created_at' | 'updated_at'>,
    imageFile?: File,
  ) => {
    setIsSubmitting(true);
    try {
      await projectService.createProject(data, imageFile);
      toast.success('Project created successfully');
      navigate({ to: '/admin/projects' });
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-1 pb-4 border-b border-light-border dark:border-[#1e2430]">
        <span className="w-fit text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/10 dark:bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] border border-amber-500/20">
          PORTFOLIO
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
          New Project
        </h1>
        <p className="text-xs text-light-subtle dark:text-[#8a9199]">
          Add a new project to the portfolio.
        </p>
      </div>

      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs p-4 sm:p-6">
        <ProjectForm
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate({ to: '/admin/projects' })}
        />
      </div>
    </div>
  );
}
