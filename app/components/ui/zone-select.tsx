import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { cn } from "~/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface ZoneSelectProps {
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function ZoneSelect({
  options,
  selected,
  onChange,
  placeholder = "Select zones...",
  className,
  disabled = false,
}: ZoneSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-[300px] justify-between text-left font-normal", className)}
        >
          <span className="truncate">
            {selected.length === 0
              ? placeholder
              : `${selected.length} zone${selected.length === 1 ? "" : "s"} selected`}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] p-2">
        <div className="flex items-center border-b mb-2 pb-2">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            placeholder="Search zones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full border-0 bg-transparent p-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0"
          />
        </div>
        <DropdownMenuGroup className="max-h-[300px] overflow-auto">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(e) => {
              e.preventDefault();
              const allValues = options.map(opt => opt.value);
              const newSelected = selected.length === options.length ? [] : allValues;
              onChange(newSelected);
            }}
          >
            <div className={cn(
              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
              selected.length === options.length ? "bg-primary text-primary-foreground" : "opacity-50"
            )}>
              <Check className={cn(
                "h-4 w-4",
                selected.length === options.length ? "opacity-100" : "opacity-0"
              )} />
            </div>
            Select All
          </DropdownMenuItem>
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm">No zones found.</div>
          ) : (
            filteredOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className="cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  const newSelected = selected.includes(option.value)
                    ? selected.filter((value) => value !== option.value)
                    : [...selected, option.value];
                  onChange(newSelected);
                }}
              >
                <div className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  selected.includes(option.value) ? "bg-primary text-primary-foreground" : "opacity-50"
                )}>
                  <Check className={cn(
                    "h-4 w-4",
                    selected.includes(option.value) ? "opacity-100" : "opacity-0"
                  )} />
                </div>
                {option.label}
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}