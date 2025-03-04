import { useState } from "react";
import { Button } from "~/components/ui/button";
import { DateRangePicker } from "~/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { DateRange } from "react-day-picker";
import type { TimeUnit } from "~/types/analytics";

interface ComparisonControlsProps {
  onTimeUnitChange: (unit: TimeUnit) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
}

const presets = [
  { label: "Last 3 months", value: "3m" },
  { label: "Previous 6 months", value: "6m" },
  { label: "Year to date", value: "ytd" },
  { label: "Last year", value: "1y" },
];

export function ComparisonControls({
  onTimeUnitChange,
  onDateRangeChange,
}: ComparisonControlsProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handlePresetClick = (preset: string) => {
    setSelectedPreset(preset);
    // TODO: Calculate date range based on preset
    // This would be implemented based on your specific requirements
  };

  return (
    <div className="space-y-4 rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Time Range</h3>
        <div className="flex items-center gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.value}
              variant={selectedPreset === preset.value ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetClick(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select onValueChange={onTimeUnitChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Day</SelectItem>
            <SelectItem value="week">Week</SelectItem>
            <SelectItem value="month">Month</SelectItem>
          </SelectContent>
        </Select>

        <DateRangePicker onChange={onDateRangeChange} className="flex-1" />
      </div>
    </div>
  );
}
