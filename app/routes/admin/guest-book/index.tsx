import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Input } from '@app/components/ui/input';
import { Button } from '@app/components/ui/button';
import { Badge } from '@app/components/ui/badge';
import { toast } from 'sonner';
import { visitorService } from '@app/services/visitorService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';
import { Search, BookOpen, Check, X } from 'lucide-react';

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

  const handleModerate = async (message: any, status: 'approved' | 'rejected') => {
    const id = message.$id || message.id;
    try {
      await visitorService.updateGuestBookMessageStatus(id, status);
      setMessages(
        messages.map((m) =>
          (m.$id || m.id) === id ? { ...m, status } : m,
        ),
      );
      toast.success(status === 'approved' ? 'Message approved' : 'Message rejected');
    } catch (error) {
      console.error('Error moderating guest book message:', error);
      toast.error('Failed to update message status');
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
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/10 dark:bg-[#e6b450]/15 text-amber-800 dark:text-[#e6b450] border border-amber-500/20">
              COMMUNITY LOG
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              {messages.length} Signatures
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Guest Book Messages
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            Visitor notes, peer greetings, and community signatures.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-light-subtle dark:text-[#8a9199]" />
          <Input
            placeholder="Search signatures..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs bg-white dark:bg-[#0a0e14] border-light-border dark:border-[#1e2430]"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
            Signed Messages ({filteredMessages.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50">
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Visitor Name</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Message</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Date</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Status</TableHead>
                <TableHead className="text-right text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Moderation</TableHead>
              </TableRow>
            </TableHeader>
            <tbody className="divide-y divide-light-border/60 dark:divide-[#1e2430]/60">
              {filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-xs font-mono text-light-subtle dark:text-[#8a9199]">
                    No guest book messages found
                  </td>
                </tr>
              ) : (
                filteredMessages.map((message) => (
                  <tr key={message.$id || message.id} className="hover:bg-light-subtle/5 dark:hover:bg-[#131721]/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-xs text-light-text dark:text-[#bfbdb6] whitespace-nowrap">{message.name}</td>
                    <td className="px-4 py-3 text-xs text-light-text dark:text-[#bfbdb6] max-w-md">{message.message}</td>
                    <td className="px-4 py-3 text-xs font-mono text-light-subtle dark:text-[#8a9199] whitespace-nowrap">{message.date}</td>
                    <td className="px-4 py-3">
                      <Badge variant={(message.status || 'approved') === 'approved' ? 'default' : (message.status === 'rejected' ? 'destructive' : 'secondary')}>
                        {(message.status || 'approved') === 'approved' ? 'Approved' : (message.status === 'rejected' ? 'Rejected' : 'Pending')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {(message.status || 'approved') !== 'approved' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs"
                            onClick={() => handleModerate(message, 'approved')}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" /> Approve
                          </Button>
                        )}
                        {(message.status || 'approved') !== 'rejected' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                            onClick={() => handleModerate(message, 'rejected')}
                          >
                            <X className="h-3.5 w-3.5 mr-1" /> Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
