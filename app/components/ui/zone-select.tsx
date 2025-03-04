import * as React from "react";
import { Check, ChevronsUpDown, Search, Info } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";
import { cn } from "~/lib/utils";
import { Subscription } from "cloudflare/resources/shared.mjs";

interface Option {
  label: string;
  value: string;
  subscriptions: Subscription[];
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

  const isAtLimit = selected.length >= 10;

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-[300px] justify-between text-left font-normal",
              className
            )}
          >
            <span className="truncate">
              {selected.length === 0
                ? placeholder
                : `${selected.length} zone${
                    selected.length === 1 ? "" : "s"
                  } selected`}
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
              className={cn("cursor-pointer", isAtLimit && "opacity-50")}
              onSelect={(e) => {
                e.preventDefault();
                if (isAtLimit) return;
                const allValues = options.slice(0, 10).map((opt) => opt.value);
                const newSelected =
                  selected.length === Math.min(options.length, 10)
                    ? []
                    : allValues;
                onChange(newSelected);
              }}
            >
              <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  selected.length === Math.min(options.length, 10)
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50"
                )}
              >
                <Check
                  className={cn(
                    "h-4 w-4",
                    selected.length === Math.min(options.length, 10)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </div>
              Select All (Max 10)
            </DropdownMenuItem>
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm">No zones found.</div>
            ) : (
              filteredOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  className={cn(
                    "cursor-pointer",
                    !selected.includes(option.value) &&
                      isAtLimit &&
                      "opacity-50"
                  )}
                  onSelect={(e) => {
                    e.preventDefault();
                    if (!selected.includes(option.value) && isAtLimit) return;
                    const newSelected = selected.includes(option.value)
                      ? selected.filter((value) => value !== option.value)
                      : [...selected, option.value];
                    onChange(newSelected);
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selected.includes(option.value)
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50"
                    )}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </div>
                  {option.label} -{" "}
                  {option.subscriptions && option.subscriptions.length > 0
                    ? option.subscriptions
                        .map((sub) => {
                          const planId = sub.rate_plan?.id as string;
                          if (!planId) return null;
                          if (
                            planId === "enterprise" ||
                            planId.startsWith("cf_ent_")
                          ) {
                            return "Ent";
                          } else if (planId === "bot_zone_ent") {
                            return "BotM";
                          }
                          return null;
                        })
                        .filter(Boolean)
                        .join(", ") || "No subscription"
                    : "Free"}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <TooltipProvider>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              type="button"
            >
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            align="center"
            className="max-w-[200px]"
          >
            <p>
              {isAtLimit
                ? "Maximum of 10 zones reached"
                : `You can select up to ${10 - selected.length} more zone${
                    10 - selected.length === 1 ? "" : "s"
                  }`}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
