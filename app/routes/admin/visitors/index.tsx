/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { visitorService } from '@app/services/visitorService';
import { Input } from '@app/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';
import { Badge } from '@app/components/ui/badge';
import { Flag, Search } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const Route = createFileRoute('/admin/visitors/')({
  component: AdminVisitors,
});

interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  recentVisits: any[];
  countryStats: Record<string, number>;
}

function AdminVisitors() {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
      console.error('Error fetching visitor data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function getShortUserAgent(ua: string) {
    if (!ua) return 'N/A';
    const match = ua.match(/([A-Za-z]+)\/[\d\.]+/);
    return match ? match[1] : ua.slice(0, 20) + (ua.length > 20 ? '...' : '');
  }

  const filteredVisits =
    stats?.recentVisits.filter((visit) => {
      const term = searchTerm.toLowerCase();
      return (
        visit.timestamp.toLowerCase().includes(term) ||
        (visit.page || '').toLowerCase().includes(term) ||
        (visit.user_agent || '').toLowerCase().includes(term) ||
        (visit.referrer || '').toLowerCase().includes(term) ||
        (visit.country_name || '').toLowerCase().includes(term)
      );
    }) || [];

  const countryData = Object.entries(stats?.countryStats || {})
    .map(([country, count]) => ({
      country,
      count,
    }))
    .sort((a, b) => b.count - a.count);

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
        <h1 className="text-3xl font-bold tracking-tight">Visitor Statistics</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search visitors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalVisits || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">{stats?.uniqueVisitors || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Visitors by Country</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={countryData.slice(0, 15)}
                margin={{ top: 10, right: 10, left: 0, bottom: 30 }}
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
                <Bar dataKey="count" fill="#2563eb" maxBarSize={28} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Visits ({filteredVisits.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Page</TableHead>
                  <TableHead>Browser / Device</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Visits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisits.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No visits recorded yet
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVisits.map((visit, index) => (
                    <TableRow key={index}>
                      <TableCell>{new Date(visit.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Flag className="w-3 h-3 text-muted-foreground" />
                          <span>{visit.country_name || 'Unknown'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{visit.page || '/'}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px]">
                          {getShortUserAgent(visit.user_agent)}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[140px] truncate text-muted-foreground">
                        {visit.referrer || 'Direct'}
                      </TableCell>
                      <TableCell>{visit.visit_count}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
