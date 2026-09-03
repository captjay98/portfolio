import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import {
  Search,
  Mail,
  User,
  Trash2,
  Inbox,
  Eye,
} from 'lucide-react';
import { toast } from 'sonner';
import { contactService, ContactSubmission } from '@app/services/contactService';
import { Button } from '@app/components/ui/button';
import { Input } from '@app/components/ui/input';
import { Card, CardContent } from '@app/components/ui/card';
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

export const Route = createFileRoute('/admin/contact-submissions/')({
  component: ContactSubmissionsPage,
});

function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<ContactSubmission | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    setIsLoading(true);
    try {
      const data = await contactService.getSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load contact submissions');
    } finally {
      setIsLoading(false);
    }
  }

  const filteredSubmissions = submissions.filter((sub) => {
    const term = searchTerm.toLowerCase();
    return (
      (sub.name || '').toLowerCase().includes(term) ||
      (sub.email || '').toLowerCase().includes(term) ||
      (sub.subject || '').toLowerCase().includes(term) ||
      (sub.message || '').toLowerCase().includes(term)
    );
  });

  const confirmDelete = async () => {
    if (!selectedSubmission) return;
    try {
      await contactService.deleteSubmission(selectedSubmission.id);
      setSubmissions(submissions.filter((s) => s.id !== selectedSubmission.id));
      toast.success('Submission deleted');
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedSubmission(null);
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
        <h2 className="text-3xl font-bold tracking-tight">Contact Submissions</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, email, subject, or message..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-muted/20 rounded-xl">
          <Inbox className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-xl font-semibold mb-1">No submissions yet</h3>
          <p className="text-muted-foreground text-center">
            When visitors submit the contact form, their messages will appear here.
          </p>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No matching submissions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-semibold">{sub.name}</TableCell>
                      <TableCell>{sub.email}</TableCell>
                      <TableCell className="max-w-xs truncate">{sub.subject}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingSubmission(sub)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedSubmission(sub);
                            setIsDeleteDialogOpen(true);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* View Message Modal */}
      <Dialog open={!!viewingSubmission} onOpenChange={(open) => !open && setViewingSubmission(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{viewingSubmission?.subject || 'Contact Message'}</DialogTitle>
            <DialogDescription>
              From {viewingSubmission?.name} ({viewingSubmission?.email}) on{' '}
              {viewingSubmission?.created_at ? new Date(viewingSubmission.created_at).toLocaleString() : ''}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-muted/30 rounded-lg text-sm whitespace-pre-wrap">
            {viewingSubmission?.message}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingSubmission(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                if (viewingSubmission?.email) {
                  window.location.href = `mailto:${viewingSubmission.email}?subject=Re: ${encodeURIComponent(viewingSubmission.subject || '')}`;
                }
              }}
            >
              <Mail className="h-4 w-4 mr-2" /> Reply via Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete message from {selectedSubmission?.name}?
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
