"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  format,
  isSameDay,
  parse,
  isValid,
  isBefore,
  startOfDay,
  fromUnixTime,
  getUnixTime,
} from "date-fns";
import { CalendarIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useStore, {
  PurchaseRequestPath,
  PurchaseRequest,
  PathValue,
} from "@/stores/global-state";
import { cn } from "@/lib/utils";

// Helper to get nested value
const getNestedValue = <P extends PurchaseRequestPath>(
  obj: PurchaseRequest,
  path: P,
): PathValue<PurchaseRequest, P> => {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (!isNaN(Number(key))) {
      current = (current as Array<unknown>)[Number(key)];
    } else {
      current = (current as Record<string, unknown>)[key];
    }
  }

  return current as PathValue<PurchaseRequest, P>;
};

// Parse various formats to Date object
const parseToDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;

  // Unix timestamp (number)
  if (typeof value === "number") {
    // Check if it's in seconds or milliseconds
    const date =
      value > 9999999999
        ? new Date(value) // milliseconds
        : fromUnixTime(value); // seconds
    return isValid(date) ? date : undefined;
  }

  // Already a Date object
  if (value instanceof Date && isValid(value)) {
    return value;
  }

  // String date
  if (typeof value === "string") {
    // Try parsing as Unix timestamp string
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      const date =
        numValue > 9999999999 ? new Date(numValue) : fromUnixTime(numValue);
      if (isValid(date)) return date;
    }

    // Try parsing common date formats
    const formats = [
      "dd MMMM yyyy",
      "MMMM dd, yyyy",
      "yyyy-MM-dd",
      "MM/dd/yyyy",
      "dd/MM/yyyy",
      "PPP",
    ];

    for (const fmt of formats) {
      try {
        const parsed = parse(value, fmt, new Date());
        if (isValid(parsed)) {
          return parsed;
        }
      } catch {
        // Continue to next format
      }
    }

    // Try native Date parsing as fallback
    const nativeParsed = new Date(value);
    if (isValid(nativeParsed)) {
      return nativeParsed;
    }
  }

  return undefined;
};

interface ComponentCustomDatePickerWithRangeProps {
  startPath: PurchaseRequestPath;
  endPath: PurchaseRequestPath;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  dateFormat?: string;
  numberOfMonths?: 1 | 2;
  className?: string;
  minDatePath?: PurchaseRequestPath;
  minDate?: Date;
  storeAsTimestamp?: boolean; // New prop to store as Unix timestamp
  timestampInMilliseconds?: boolean; // Use milliseconds instead of seconds
}

export function ComponentCustomDatePickerWithRange({
  startPath,
  endPath,
  label,
  placeholder = "Pick a date range",
  required,
  disabled,
  disabledReason,
  dateFormat = "LLL dd, y",
  numberOfMonths = 2,
  className,
  minDatePath,
  minDate,
  storeAsTimestamp = false,
  timestampInMilliseconds = false,
}: ComponentCustomDatePickerWithRangeProps) {
  // Get raw values from store
  const rawStartDate = useStore((state) =>
    getNestedValue(state.purchaseRequest, startPath),
  );

  const rawEndDate = useStore((state) =>
    getNestedValue(state.purchaseRequest, endPath),
  );

  // Get min date from path if provided
  const minDateFromPath = useStore((state) =>
    minDatePath
      ? getNestedValue(state.purchaseRequest, minDatePath)
      : undefined,
  );

  const setField = useStore((state) => state.setField);

  // Parse to Date objects for calendar display
  const startDate = React.useMemo(
    () => parseToDate(rawStartDate),
    [rawStartDate],
  );

  const endDate = React.useMemo(() => parseToDate(rawEndDate), [rawEndDate]);

  // Parse the minimum date
  const parsedMinDate = React.useMemo(() => {
    if (minDate) return startOfDay(minDate);
    if (minDateFromPath) {
      const parsed = parseToDate(minDateFromPath);
      return parsed ? startOfDay(parsed) : undefined;
    }
    return undefined;
  }, [minDate, minDateFromPath]);

  // Disable dates before minDate
  const disabledDays = React.useMemo(() => {
    if (!parsedMinDate) return undefined;
    return (date: Date) => isBefore(startOfDay(date), parsedMinDate);
  }, [parsedMinDate]);

  // Convert Date to storage format (Unix timestamp or Date)
  const toStorageValue = (date: Date | undefined): unknown => {
    if (!date) return undefined;

    if (storeAsTimestamp) {
      return timestampInMilliseconds
        ? date.getTime() // milliseconds
        : getUnixTime(date); // seconds
    }

    return date;
  };

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    setField(startPath, toStorageValue(range?.from) as never);
    setField(endPath, toStorageValue(range?.to) as never);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setField(startPath, undefined as never);
    setField(endPath, undefined as never);
  };

  const hasValue = startDate || endDate;

  // Check if both dates are the same day
  const isSingleDate = startDate && endDate && isSameDay(startDate, endDate);

  // Format the display text
  const formatDateRange = () => {
    if (startDate && endDate && !isSingleDate) {
      return `${format(startDate, dateFormat)} - ${format(endDate, dateFormat)}`;
    }
    if (startDate) {
      return format(startDate, dateFormat);
    }
    if (endDate) {
      return format(endDate, dateFormat);
    }
    return placeholder;
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Label */}
      <div className="flex items-center gap-1">
        <Label className="flex items-center">
          {label}
          {required && !disabled && (
            <span className="text-red-500 ml-0.5">*</span>
          )}
        </Label>
        {disabled && disabledReason && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{disabledReason}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            data-empty={!hasValue}
            className={cn(
              "w-full justify-between p-3 text-left font-normal",
              "data-[empty=true]:text-muted-foreground",
              "disabled:opacity-100",
            )}
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              {formatDateRange()}
            </span>

            {/* Right side icon */}
            {hasValue && !disabled ? (
              <span
                role="button"
                onClick={handleClear}
                onMouseDown={(e) => e.preventDefault()}
                className="hover:bg-muted rounded-sm p-0.5 -mr-0.5"
              >
                <XIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </span>
            ) : (
              <ChevronDownIcon className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={startDate || parsedMinDate}
            selected={{
              from: startDate,
              to: endDate,
            }}
            onSelect={handleSelect}
            numberOfMonths={numberOfMonths}
            disabled={disabledDays}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ComponentCustomDatePickerWithRange;
