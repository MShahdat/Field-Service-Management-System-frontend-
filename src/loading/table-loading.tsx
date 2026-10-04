/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GenericTableSkeletonProps {
  columnCount: number;
  rowCount?: number;
}

export default function GenericTableSkeleton({
  columnCount,
  rowCount = 5,
}: GenericTableSkeletonProps) {
  const rows = Array.from({ length: rowCount });
  const columns = Array.from({ length: columnCount });

  const widths = ["w-12", "w-24", "w-32", "w-40", "w-20", "w-28"];

  return (
    <div className="border rounded-lg w-full overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((_, colIdx) => (
              <TableHead key={`head-${colIdx}`}>
                <Skeleton className="h-4 w-16" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((_, rowIdx) => (
            <TableRow key={`row-${rowIdx}`}>
              {columns.map((_, colIdx) => {
                const widthClass = widths[colIdx % widths.length];

                return (
                  <TableCell key={`cell-${rowIdx}-${colIdx}`}>
                    <Skeleton className={`h-4 ${widthClass}`} />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
