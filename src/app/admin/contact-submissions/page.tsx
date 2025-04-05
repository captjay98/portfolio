"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Calendar,
  Mail,
  User,
  ExternalLink,
  ChevronDown,
  Trash2,
  Inbox,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

// Import services and types
import { contactService, ContactSubmission } from "@/services/contactService";

// Import Shadcn components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Badge } from "@/components/ui/badge";

export default function ContactSubmissionsPage() {
  useEffect(() => {
    // Set page metadata on client side
    document.title = "Contact Submissions | Admin";
  }, []);

  const router = useRouter();
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"name" | "email" | "date">("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ContactSubmission | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  // Fetch data on component mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    setIsLoading(true);
    try {
      const data = await contactService.getSubmissions();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load contact submissions");
    } finally {
      setIsLoading(false);
    }
  }

  // Filter and sort submissions
  const filteredSubmissions = [...submissions]
    .filter((submission) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        submission.name.toLowerCase().includes(searchLower) ||
        submission.email.toLowerCase().includes(searchLower) ||
        submission.subject.toLowerCase().includes(searchLower) ||
        submission.message.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === "email") {
        return sortDirection === "asc"
          ? a.email.localeCompare(b.email)
          : b.email.localeCompare(a.email);
      } else {
        // Default sort by date
        return sortDirection === "asc"
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  const toggleSort = (field: "name" | "email" | "date") => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection(field === "date" ? "desc" : "asc");
    }
  };

  const handleViewSubmission = (id: string) => {
    router.push(`/admin/contact-submissions/${id}`);
  };

  const handleDeleteSubmission = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSubmission) return;

    try {
      const toastId = toast.loading("Deleting submission...");
      await contactService.deleteSubmission(selectedSubmission.id);
      setSubmissions(submissions.filter((s) => s.id !== selectedSubmission.id));
      toast.success("Submission deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedSubmission(null);
    }
  };

  if (isLoading) {
    return <TableSkeleton columns={5} rows={5} searchField={true} />;
  }

  const isEmptyState = submissions.length === 0;
  const noSearchResults =
    submissions.length > 0 && filteredSubmissions.length === 0;

  return (
    <div className="space-y-6 pb-20">
      <Toaster position="top-right" />

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Contact Submissions
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="px-3"
          >
            Table
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className="px-3"
          >
            Cards
          </Button>
        </div>
      </div>

      {/* Search field */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, email, subject or message content..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isEmptyState && (
        <div className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-lg">
          <Inbox className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-xl font-semibold mb-1">No submissions yet</h3>
          <p className="text-muted-foreground text-center max-w-md">
            When visitors submit the contact form, their messages will appear
            here.
          </p>
        </div>
      )}

      {noSearchResults && (
        <div className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-lg">
          <Search className="h-12 w-12 text-muted-foreground mb-3" />
          <h3 className="text-xl font-semibold mb-1">No matching results</h3>
          <p className="text-muted-foreground text-center">
            Try adjusting your search term to find what you are looking for.
          </p>
          <Button
            variant="link"
            onClick={() => setSearchTerm("")}
            className="mt-2"
          >
            Clear search
          </Button>
        </div>
      )}

      {!isEmptyState && !noSearchResults && (
        <>
          {/* Show count info */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredSubmissions.length} of {submissions.length}{" "}
            submissions
          </div>

          {viewMode === "table" ? (
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="w-[200px] cursor-pointer"
                        onClick={() => toggleSort("name")}
                      >
                        <div className="flex items-center gap-1">
                          Name
                          {sortField === "name" && (
                            <ChevronDown
                              className={`h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead
                        className="w-[250px] cursor-pointer"
                        onClick={() => toggleSort("email")}
                      >
                        <div className="flex items-center gap-1">
                          Email
                          {sortField === "email" && (
                            <ChevronDown
                              className={`h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="w-[300px]">Subject</TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => toggleSort("date")}
                      >
                        <div className="flex items-center gap-1">
                          Date
                          {sortField === "date" && (
                            <ChevronDown
                              className={`h-4 w-4 ${sortDirection === "desc" ? "transform rotate-180" : ""}`}
                            />
                          )}
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow
                        key={submission.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewSubmission(submission.id)}
                      >
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-muted-foreground" />
                            <span>{submission.name}</span>
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-muted-foreground" />
                            <a
                              href={`mailto:${submission.email}`}
                              className="hover:underline text-primary"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {submission.email}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="line-clamp-1 font-medium">
                            {submission.subject}
                          </div>
                        </TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <Calendar
                              size={16}
                              className="text-muted-foreground"
                            />
                            <span>
                              {formatDistanceToNow(
                                new Date(submission.created_at),
                                { addSuffix: true },
                              )}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewSubmission(submission.id);
                              }}
                            >
                              <ExternalLink size={16} />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubmission(submission);
                              }}
                            >
                              <Trash2 size={16} />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSubmissions.map((submission) => (
                <Card
                  key={submission.id}
                  className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewSubmission(submission.id)}
                >
                  <CardContent className="p-0">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold line-clamp-1">
                          {submission.subject}
                        </h3>
                        <Badge variant="outline" className="ml-2">
                          {formatDistanceToNow(
                            new Date(submission.created_at),
                            { addSuffix: true },
                          )}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-center">
                          <User
                            size={14}
                            className="mr-2 text-muted-foreground"
                          />
                          <span>{submission.name}</span>
                        </div>
                        <div className="flex items-center">
                          <Mail
                            size={14}
                            className="mr-2 text-muted-foreground"
                          />
                          <a
                            href={`mailto:${submission.email}`}
                            className="text-primary hover:underline truncate"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {submission.email}
                          </a>
                        </div>
                      </div>

                      <p className="text-muted-foreground line-clamp-2 text-sm mb-4">
                        {submission.message}
                      </p>

                      <div className="flex justify-end gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `mailto:${submission.email}?subject=Re: ${submission.subject}`;
                          }}
                        >
                          <Mail size={14} className="mr-2" />
                          Reply
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubmission(submission);
                          }}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this contact submission from{" "}
              {selectedSubmission?.name}? This action cannot be undone.
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
