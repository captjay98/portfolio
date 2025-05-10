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
          visitorService.getRecentVisits(500),
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

  // Helper to truncate user agent string
  function getShortUserAgent(ua: string) {
    if (!ua) return "N/A";
    // Try to extract browser name/version, fallback to first 20 chars
    const match = ua.match(/([A-Za-z]+)\/[\d\.]+/);
    return match ? match[1] : ua.slice(0, 20) + (ua.length > 20 ? "..." : "");
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

  const countryData = Object.entries(stats?.countryStats || {})
    .map(([country, count]) => ({
      country,
      count,
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending

  if (isLoading) {
    return <TableSkeleton columns={6} rows={5} />;
  }

  return (
    <div className="space-y-6 pb-20  mx-auto">
      <Toaster />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Visitor Statistics</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Statistics</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            <div>
              <h3 className="text-xs font-medium">Total Visits</h3>
              <p className="text-xl font-bold">{stats?.totalVisits || 0}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium">Unique Visitors</h3>
              <p className="text-xl font-bold">{stats?.uniqueVisitors || 0}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Visitors by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={countryData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
                  barCategoryGap={8}
                >
                  <XAxis
                    dataKey="country"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={50}
                  />
                  <YAxis tick={{ fontSize: 10 }} width={30} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2563eb" maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="text-xs min-w-[900px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap px-2 py-1">Date</TableHead>
                    <TableHead className="whitespace-nowrap px-2 py-1 max-w-[90px]">Country</TableHead>
                    <TableHead className="whitespace-nowrap px-2 py-1 max-w-[120px]">Page</TableHead>
                    <TableHead className="whitespace-nowrap px-2 py-1 max-w-[100px]">Browser</TableHead>
                    <TableHead className="whitespace-nowrap px-2 py-1 max-w-[120px]">Referrer</TableHead>
                    <TableHead className="whitespace-nowrap px-2 py-1">Visit Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisits.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No visits found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVisits.map((visit, index) => (
                      <TableRow key={index} className="h-8">
                        <TableCell className="px-2 py-1">
                          {new Date(visit.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="px-2 py-1 max-w-[90px] truncate flex items-center gap-1">
                          <Flag className="w-3 h-3" />
                          <span className="truncate">{visit.country_name}</span>
                        </TableCell>
                        <TableCell className="px-2 py-1 max-w-[120px] truncate">{visit.page || "N/A"}</TableCell>
                        <TableCell className="px-2 py-1 max-w-[100px] truncate">
                          <Badge variant="secondary" className="text-[10px] px-1 py-0.5">
                            {getShortUserAgent(visit.user_agent)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-2 py-1 max-w-[120px] truncate">{visit.referrer || "N/A"}</TableCell>
                        <TableCell className="px-2 py-1">{visit.visit_count}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
