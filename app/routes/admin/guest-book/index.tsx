import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Input } from '@app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import { visitorService } from '@app/services/visitorService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';
import { Search } from 'lucide-react';

export const Route = createFileRoute('/admin/guest-book/')({
  component: AdminGuestBook,
});

function AdminGuestBook() {
  const [messages, setMessages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const msgs = await visitorService.getGuestBookMessages();
      setMessages(msgs);
    } catch (error) {
      console.error('Error fetching guest book messages:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredMessages = messages.filter((message) => {
    const term = searchTerm.toLowerCase();
    return (
      (message.name || '').toLowerCase().includes(term) ||
      (message.message || '').toLowerCase().includes(term) ||
      (message.date || '').toLowerCase().includes(term)
    );
  });

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Guest Book Messages</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Signed Messages ({filteredMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visitor Name</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    No guest book messages found
                  </TableCell>
                </TableRow>
              ) : (
                filteredMessages.map((message) => (
                  <TableRow key={message.$id || message.id}>
                    <TableCell className="font-semibold">{message.name}</TableCell>
                    <TableCell className="max-w-md">{message.message}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{message.date}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
