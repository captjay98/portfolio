"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, User, Calendar, Trash2, ArrowLeft } from "lucide-react";
import { contactService, ContactSubmission } from "@/services/contactService";
import { format, formatDistanceToNow } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import { notFound } from "next/navigation";

// Import UI components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/ui/table-skeleton";

export default function SubmissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<ContactSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchSubmission() {
      try {
        setIsLoading(true);
        const id = params.id as string;
        const data = await contactService.getSubmission(id);
        setSubmission(data);
        // Update the document title
        document.title = `${data.subject} | Contact Submission`;
      } catch (err) {
        console.error("Error fetching submission:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }

    if (params.id) {
      fetchSubmission();
    }
  }, [params.id]);

  const handleDelete = async () => {
    if (!submission) return;

    setIsDeleting(true);
    try {
      const toastId = toast.loading("Deleting submission...");
      await contactService.deleteSubmission(submission.id);
      toast.success("Submission deleted successfully", { id: toastId });
      router.push("/admin/contact-submissions");
      router.refresh();
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <TableSkeleton columns={1} rows={3} />;
  }

  if (error || !submission) {
    return notFound();
  }

  const createdDate = new Date(submission.created_at);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          variant="ghost"
          className="pl-0 flex items-center gap-2"
          onClick={() => router.push("/admin/contact-submissions")}
        >
          <ArrowLeft size={16} />
          Back to submissions
        </Button>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              (window.location.href = `mailto:${submission.email}?subject=Re: ${submission.subject}`)
            }
          >
            <Mail size={16} className="mr-2" />
            Reply
          </Button>

          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">{submission.subject}</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="flex items-center text-muted-foreground">
                  <User size={18} className="mr-2" />
                  <span className="font-medium">From:</span>
                </div>
                <p className="mt-1 font-medium">{submission.name}</p>
              </div>

              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="flex items-center text-muted-foreground">
                  <Mail size={18} className="mr-2" />
                  <span className="font-medium">Email:</span>
                </div>
                <a
                  href={`mailto:${submission.email}`}
                  className="mt-1 text-primary hover:underline"
                >
                  {submission.email}
                </a>
              </div>

              <div className="bg-muted/20 p-4 rounded-lg">
                <div className="flex items-center text-muted-foreground">
                  <Calendar size={18} className="mr-2" />
                  <span className="font-medium">Date:</span>
                </div>
                <p className="mt-1">{format(createdDate, "PPP 'at' p")}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(createdDate, { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium mb-3">Message:</h2>
            <div className="bg-muted/20 p-5 rounded-lg whitespace-pre-wrap">
              {submission.message}
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact submission from{" "}
              {submission.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
