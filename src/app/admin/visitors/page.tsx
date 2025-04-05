/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { visitorService } from "@/services/visitorService";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Toaster } from "@/components/ui/sonner";
import { Badge } from "@/components/ui/badge";
import { Flag } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  recentVisits: any[];
  countryStats: Record<string, number>;
}

export default function AdminVisitors() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [totalVisits, uniqueVisitors, recentVisits, countryStats] =
        await Promise.all([
          visitorService.getVisitorCount(),
          visitorService.getUniqueVisitorCount(),
          visitorService.getRecentVisits(),
          visitorService.getVisitorStatsByCountry(),
        ]);

      setStats({
        totalVisits,
        uniqueVisitors,
        recentVisits,
        countryStats,
      });
    } catch (error) {
      console.error("Error fetching visitor data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredVisits =
    stats?.recentVisits.filter((visit) => {
      return (
        visit.timestamp.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (visit.page || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (visit.user_agent || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (visit.referrer || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (visit.country_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }) || [];

  const countryData = Object.entries(stats?.countryStats || {}).map(
    ([country, count]) => ({
      country,
      count,
    }),
  );

  if (isLoading) {
    return <TableSkeleton columns={6} rows={5} />;
  }

  return (
    <div className="container mx-auto p-4 pb-16">
      <Toaster />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Visitor Statistics</h1>
        <div className="flex gap-4">
          <Input
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium">Total Visits</h3>
              <p className="text-2xl font-bold">{stats?.totalVisits || 0}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium">Unique Visitors</h3>
              <p className="text-2xl font-bold">{stats?.uniqueVisitors || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visitors by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData}>
                  <XAxis dataKey="country" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Visit Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisits.map((visit, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {new Date(visit.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Flag className="w-4 h-4" />
                      <span>{visit.country_name}</span>
                    </TableCell>
                    <TableCell>{visit.page || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {visit.user_agent
                          // ? visit.user_agent.split("(")[0].trim()
                          // : "N/A"
                          }
                      </Badge>
                    </TableCell>
                    <TableCell>{visit.referrer || "N/A"}</TableCell>
                    <TableCell>{visit.visit_count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
