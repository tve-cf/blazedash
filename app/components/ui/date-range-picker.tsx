import * as React from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "./button";
import { Calendar } from "./calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "~/lib/utils";

type DateRangePickerMode = "custom" | "month";

interface DateRangePickerProps {
  className?: string;
  onChange?: (date: DateRange | undefined) => void;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DateRangePicker({ className, onChange }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [mode, setMode] = React.useState<DateRangePickerMode>("custom");
  const [selectedYear, setSelectedYear] = React.useState(
    new Date().getFullYear(),
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const currentYear = new Date().getFullYear();
  const currentDate = new Date();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleSelect = (range: DateRange | undefined) => {
    if (range?.from && range.from > currentDate) return;
    if (range?.to && range.to > currentDate) return;

    setDate(range);
    onChange?.(range);
    if (mode === "month") {
      setIsOpen(false);
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const from = new Date(selectedYear, monthIndex, 1);
    const to = new Date(selectedYear, monthIndex + 1, 0);

    if (from > currentDate) return;
    if (to > currentDate) {
      if (
        monthIndex === currentDate.getMonth() &&
        selectedYear === currentDate.getFullYear()
      ) {
        handleSelect({ from, to: currentDate });
      }
      return;
    }

    handleSelect({ from, to });
  };

  const changeYear = (delta: number) => {
    const newYear = selectedYear + delta;
    if (newYear > currentDate.getFullYear()) return;
    setSelectedYear(newYear);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-[160px] font-normal h-9 flex items-center justify-between"
          >
            <span>{mode === "custom" ? "Custom Range" : "Month"}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[160px]">
          <DropdownMenuItem onSelect={() => setMode("custom")}>
            Custom Range
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setMode("month")}>
            Month
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[240px] justify-start text-left font-normal h-9",
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {mode === "custom" ? (
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
              disabled={{ after: currentDate }}
            />
          ) : (
            <div className="p-3">
              <div className="mb-4 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => changeYear(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">{selectedYear}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => changeYear(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, index) => (
                  <Button
                    key={month}
                    variant="outline"
                    disabled={
                      selectedYear === currentDate.getFullYear() &&
                      index > currentDate.getMonth()
                    }
                    className={cn(
                      "h-9",
                      date?.from &&
                        date.from.getMonth() === index &&
                        date.from.getFullYear() === selectedYear
                        ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                        : "",
                    )}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
