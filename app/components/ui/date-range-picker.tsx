import * as React from "react";
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
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
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function DateRangePicker({ className, onChange }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>();
  const [mode, setMode] = React.useState<DateRangePickerMode>("custom");
  const [selectedYear, setSelectedYear] = React.useState(new Date().getFullYear());
  const [isOpen, setIsOpen] = React.useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range);
    onChange?.(range);
    if (mode === "month") {
      setIsOpen(false);
    }
  };

  const handleMonthSelect = (monthIndex: number) => {
    const from = new Date(selectedYear, monthIndex, 1);
    const to = new Date(selectedYear, monthIndex + 1, 0);
    handleSelect({ from, to });
  };

  const changeYear = (delta: number) => {
    setSelectedYear(prev => prev + delta);
  };

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-9 px-4 py-2"
          >
            {mode === "custom" ? "Custom Range" : "Month"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setMode("custom")}>
            Custom Range
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMode("month")}>
            Month
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {mode === "custom" ? (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                className
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
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  className
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  format(date.from, "MMMM yyyy")
                ) : (
                  <span>Select month</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[280px] p-0">
              <div className="flex items-center justify-between border-b p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => changeYear(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="font-semibold">
                      {selectedYear}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="max-h-[200px] overflow-y-auto">
                    {years.map((year) => (
                      <DropdownMenuItem key={year} onClick={() => setSelectedYear(year)}>{year}</DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => changeYear(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-1 p-2">
                {months.map((month, index) => (
                  <DropdownMenuItem
                    key={month}
                    className={cn("cursor-pointer justify-center", 
                      date?.from && new Date(date.from).getMonth() === index ? "bg-accent" : ""
                    )}
                    onClick={() => handleMonthSelect(index)}
                  >
                    {month}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}