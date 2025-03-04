import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import type { PeriodData, TrafficData } from "~/types/analytics";

interface ComparisonTableProps {
  data: PeriodData[];
  timeUnit: string;
}

const metrics = ["Requests", "Page Views", "Data Transfer"];

export function ComparisonTable({ data, timeUnit }: ComparisonTableProps) {
  // Get unique hostnames from all periods
  const hostnames = Array.from(
    new Set(data.flatMap((period) => period.data.map((item) => item.hostname))),
  ).sort();

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Hostname</TableHead>
            <TableHead>Metric</TableHead>
            {data.map((period) => (
              <TableHead key={period.period}>{period.period}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {hostnames.map((hostname) => (
            <React.Fragment key={hostname}>
              {metrics.map((metric, metricIndex) => (
                <TableRow key={`${hostname}-${metric}`}>
                  {metricIndex === 0 ? (
                    <TableCell
                      rowSpan={metrics.length}
                      className="align-middle font-medium border-r"
                    >
                      {hostname}
                    </TableCell>
                  ) : null}
                  <TableCell className="font-medium text-muted-foreground">
                    {metric}
                  </TableCell>
                  {data.map((period) => {
                    const hostData = period.data.find(
                      (item) => item.hostname === hostname,
                    );
                    return (
                      <TableCell key={period.period} className="text-right">
                        {hostData
                          ? metric === "Requests"
                            ? hostData.metrics.requests.toLocaleString()
                            : metric === "Page Views"
                              ? hostData.metrics.pageViews.toLocaleString()
                              : hostData.metrics.dataTransfer
                          : "-"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
