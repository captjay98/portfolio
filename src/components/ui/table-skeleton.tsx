import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "./skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface TableSkeletonProps {
  columns: number;
  rows: number;
  searchField?: boolean;
  filterField?: boolean;
}

export function TableSkeleton({
  columns = 4,
  rows = 5,
  searchField = true,
}: TableSkeletonProps) {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Search bar skeleton */}
      {searchField && (
        <div className="relative">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      )}

      {/* Table card skeleton */}
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                {Array(columns)
                  .fill(0)
                  .map((_, index) => (
                    <TableHead key={`header-${index}`}>
                      <Skeleton className="h-5 w-full max-w-24" />
                    </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(rows)
                .fill(0)
                .map((_, rowIndex) => (
                  <TableRow key={`row-${rowIndex}`}>
                    {Array(columns)
                      .fill(0)
                      .map((_, colIndex) => (
                        <TableCell key={`cell-${rowIndex}-${colIndex}`}>
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
