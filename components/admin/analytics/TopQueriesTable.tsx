import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SparklineMini } from "./SparklineMini";
import type { TopQueryWithTrend } from "@/types/analytics";

interface TopQueriesTableProps {
  queries: TopQueryWithTrend[];
  maxRows?: number;
}

export function TopQueriesTable({ queries, maxRows = 15 }: TopQueriesTableProps) {
  const rows = queries.slice(0, maxRows);

  return (
    <Card className="bg-white border-neutral-200">
      <div className="px-4 md:px-6 pt-6">
        <h3 className="text-sm uppercase tracking-wider font-medium text-neutral-500">
          Top queries no Google Search
        </h3>
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="border-neutral-200 hover:bg-transparent">
              <TableHead className="text-neutral-500 font-medium uppercase text-xs tracking-wider pl-6">
                Query
              </TableHead>
              <TableHead className="text-right text-neutral-500 font-medium uppercase text-xs tracking-wider">
                Cliques
              </TableHead>
              <TableHead className="text-right text-neutral-500 font-medium uppercase text-xs tracking-wider">
                Impressões
              </TableHead>
              <TableHead className="text-right text-neutral-500 font-medium uppercase text-xs tracking-wider">
                CTR
              </TableHead>
              <TableHead className="text-right text-neutral-500 font-medium uppercase text-xs tracking-wider">
                Posição
              </TableHead>
              <TableHead className="text-center text-neutral-500 font-medium uppercase text-xs tracking-wider pr-6 w-24">
                Tendência
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((q, i) => (
              <TableRow key={i} className="border-neutral-100 hover:bg-[#FAF8F2]">
                <TableCell className="pl-6 font-medium text-neutral-900">{q.query}</TableCell>
                <TableCell className="text-right tabular-nums">{q.clicks.toLocaleString("pt-BR")}</TableCell>
                <TableCell className="text-right tabular-nums text-neutral-600">
                  {q.impressions.toLocaleString("pt-BR")}
                </TableCell>
                <TableCell className="text-right tabular-nums text-neutral-600">{q.ctr}%</TableCell>
                <TableCell className="text-right tabular-nums text-neutral-600">{q.position}</TableCell>
                <TableCell className="pr-6">
                  {q.trend && q.trend.length > 1 ? (
                    <SparklineMini data={q.trend} height={24} color="#0A0A0A" />
                  ) : (
                    <span className="text-neutral-300">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden divide-y divide-neutral-100 px-4 pb-4 mt-4">
        {rows.map((q, i) => (
          <div key={i} className="py-4">
            <h4 className="text-sm font-semibold text-neutral-900 mb-3 leading-snug">
              {q.query}
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
              <div>
                <div className="text-neutral-500">Cliques</div>
                <div className="text-neutral-900 font-semibold tabular-nums">
                  {q.clicks.toLocaleString("pt-BR")}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Impressões</div>
                <div className="text-neutral-900 font-semibold tabular-nums">
                  {q.impressions.toLocaleString("pt-BR")}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">CTR</div>
                <div className="text-neutral-900 font-semibold tabular-nums">{q.ctr}%</div>
              </div>
              <div>
                <div className="text-neutral-500">Posição</div>
                <div className="text-neutral-900 font-semibold tabular-nums">{q.position}</div>
              </div>
            </div>
            {q.trend && q.trend.length > 1 && (
              <div className="mt-3">
                <SparklineMini data={q.trend} height={20} color="#0A0A0A" />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
