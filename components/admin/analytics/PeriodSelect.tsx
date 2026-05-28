"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PeriodSelectProps {
  availableMonths: string[]; // ["2026-04", "2026-03", ...]
  currentMonth: string;
}

const PT_BR_MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function formatMonthLabel(slug: string): string {
  const [year, m] = slug.split("-");
  return `${PT_BR_MONTHS[parseInt(m) - 1]}/${year}`;
}

export function PeriodSelect({ availableMonths, currentMonth }: PeriodSelectProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (newMonth: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("month", newMonth);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Select value={currentMonth} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px] bg-white">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {availableMonths.map((m) => (
          <SelectItem key={m} value={m}>
            {formatMonthLabel(m)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
