/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { visitorService } from '@app/services/visitorService';
import { Input } from '@app/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/components/ui/table';
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
      <div className="space-y-4 py-8">
        <div className="h-6 w-48 bg-light-subtle/10 dark:bg-[#131721] rounded animate-pulse" />
        <div className="grid gap-3 sm:gap-4 grid-cols-2">
          <div className="h-24 bg-white dark:bg-[#0a0e14] border border-light-border dark:border-[#1e2430] rounded-xl animate-pulse" />
          <div className="h-24 bg-white dark:bg-[#0a0e14] border border-light-border dark:border-[#1e2430] rounded-xl animate-pulse" />
        </div>
        <div className="h-64 bg-white dark:bg-[#0a0e14] border border-light-border dark:border-[#1e2430] rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-light-border dark:border-[#1e2430]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-cyan-500/10 dark:bg-[#39bae6]/15 text-cyan-800 dark:text-[#39bae6] border border-cyan-500/20">
              TELEMETRY & TRAFFIC
            </span>
            <span className="text-xs font-mono text-light-subtle dark:text-[#8a9199]">
              {stats?.totalVisits || 0} Total Visits
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-light-text dark:text-[#bfbdb6]">
            Visitor Statistics
          </h1>
          <p className="text-xs text-light-subtle dark:text-[#8a9199]">
            Real-time telemetry, geographic breakdown, and reader access logs.
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-light-subtle dark:text-[#8a9199]" />
          <Input
            placeholder="Search visitor logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs bg-white dark:bg-[#0a0e14] border-light-border dark:border-[#1e2430]"
          />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2">
        <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] p-4 sm:p-5 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
            Total Visits
          </span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-blue-600 dark:text-[#39bae6] mt-1">
            {stats?.totalVisits || 0}
          </p>
        </div>

        <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] p-4 sm:p-5 shadow-xs">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
            Unique Visitors
          </span>
          <p className="text-2xl sm:text-3xl font-bold font-mono text-indigo-600 dark:text-[#e6b450] mt-1">
            {stats?.uniqueVisitors || 0}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] p-4 sm:p-5 shadow-xs">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-light-subtle dark:text-[#8a9199] mb-4">
          Visitors by Country
        </h3>
        <div className="h-48 sm:h-56">
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
      </div>

      {/* Recent Visits Table */}
      <div className="bg-white dark:bg-[#0a0e14] rounded-xl border border-light-border dark:border-[#1e2430] shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50 flex items-center justify-between">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">
            Recent Access Logs ({filteredVisits.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="border-b border-light-border dark:border-[#1e2430] bg-light-background/60 dark:bg-[#131721]/50">
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Date</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Country</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Page</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Browser / Device</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Referrer</TableHead>
                <TableHead className="text-xs font-mono font-semibold uppercase tracking-wider text-light-subtle dark:text-[#8a9199]">Visits</TableHead>
              </TableRow>
            </TableHeader>
            <tbody className="divide-y divide-light-border/60 dark:divide-[#1e2430]/60">
              {filteredVisits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs font-mono text-light-subtle dark:text-[#8a9199]">
                    No visits recorded matching query
                  </td>
                </tr>
              ) : (
                filteredVisits.map((visit, index) => (
                  <tr key={index} className="hover:bg-light-subtle/5 dark:hover:bg-[#131721]/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-light-text dark:text-[#bfbdb6]">
                      {new Date(visit.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-light-text dark:text-[#bfbdb6]">
                        <Flag className="w-3 h-3 text-light-subtle dark:text-[#8a9199]" />
                        <span>{visit.country_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-light-subtle dark:text-[#8a9199]">
                      {visit.page || '/'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-light-subtle/10 dark:bg-[#131721] text-light-subtle dark:text-[#8a9199] border border-light-border dark:border-[#1e2430]">
                        {getShortUserAgent(visit.user_agent)}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[140px] truncate text-light-subtle dark:text-[#8a9199]">
                      {visit.referrer || 'Direct'}
                    </td>
                    <td className="px-4 py-3 font-mono text-light-text dark:text-[#bfbdb6]">
                      {visit.visit_count}
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
