"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { visitorService } from "@/services/visitorService";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GuestBookMessage {
  $id: string;
  name: string;
  message: string;
  date: string;
  $createdAt: string;
  $updatedAt: string;
}

export default function AdminGuestBook() {
  const [messages, setMessages] = useState<GuestBookMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const messages = await visitorService.getGuestBookMessages();
      setMessages(messages);
    } catch (error) {
      console.error("Error fetching guest book messages:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredMessages = messages.filter((message) => {
    return (
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.date.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (isLoading) {
    return <TableSkeleton columns={4} rows={5} />;
  }

  return (
    <div className="container mx-auto p-4">
      <Toaster />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Guest Book Messages</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMessages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No messages found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMessages.map((message) => (
                    <TableRow key={message.$id}>
                      <TableCell>{message.name}</TableCell>
                      <TableCell className="whitespace-pre-wrap max-w-[300px]">
                        {message.message}
                      </TableCell>
                      <TableCell>
                        {new Date(message.$createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{message.date}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
