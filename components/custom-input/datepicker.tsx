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
  parse,
  isValid,
  isBefore,
  isAfter,
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

interface ComponentCustomDatePickerProps {
  path: PurchaseRequestPath;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  dateFormat?: string;
  className?: string;
  // Min date options
  minDatePath?: PurchaseRequestPath;
  minDate?: Date;
  // Max date options
  maxDatePath?: PurchaseRequestPath;
  maxDate?: Date;
  // Timestamp options
  storeAsTimestamp?: boolean;
  timestampInMilliseconds?: boolean;
}

export function ComponentCustomDatePicker({
  path,
  label,
  placeholder = "Pick a date",
  required,
  disabled,
  disabledReason,
  dateFormat = "PPP",
  className,
  minDatePath,
  minDate,
  maxDatePath,
  maxDate,
  storeAsTimestamp = false,
  timestampInMilliseconds = false,
}: ComponentCustomDatePickerProps) {
  // Get raw value from store
  const rawValue = useStore((state) =>
    getNestedValue(state.purchaseRequest, path),
  );

  // Get min date from path if provided
  const minDateFromPath = useStore((state) =>
    minDatePath
      ? getNestedValue(state.purchaseRequest, minDatePath)
      : undefined,
  );

  // Get max date from path if provided
  const maxDateFromPath = useStore((state) =>
    maxDatePath
      ? getNestedValue(state.purchaseRequest, maxDatePath)
      : undefined,
  );

  const setField = useStore((state) => state.setField);

  // Parse to Date object for calendar display
  const value = React.useMemo(() => parseToDate(rawValue), [rawValue]);

  // Parse the minimum date
  const parsedMinDate = React.useMemo(() => {
    if (minDate) return startOfDay(minDate);
    if (minDateFromPath) {
      const parsed = parseToDate(minDateFromPath);
      return parsed ? startOfDay(parsed) : undefined;
    }
    return undefined;
  }, [minDate, minDateFromPath]);

  // Parse the maximum date
  const parsedMaxDate = React.useMemo(() => {
    if (maxDate) return startOfDay(maxDate);
    if (maxDateFromPath) {
      const parsed = parseToDate(maxDateFromPath);
      return parsed ? startOfDay(parsed) : undefined;
    }
    return undefined;
  }, [maxDate, maxDateFromPath]);

  // Disable dates outside min/max range
  const disabledDays = React.useMemo(() => {
    if (!parsedMinDate && !parsedMaxDate) return undefined;

    return (date: Date) => {
      const day = startOfDay(date);

      if (parsedMinDate && isBefore(day, parsedMinDate)) {
        return true;
      }

      if (parsedMaxDate && isAfter(day, parsedMaxDate)) {
        return true;
      }

      return false;
    };
  }, [parsedMinDate, parsedMaxDate]);

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

  const handleSelect = (date: Date | undefined) => {
    setField(path, toStorageValue(date) as never);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setField(path, undefined as never);
  };

  const hasValue = value !== undefined;

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

      {/* Date Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            data-empty={!hasValue}
            className={cn(
              "w-full justify-between text-left font-normal p-3",
              "data-[empty=true]:text-muted-foreground",
              "disabled:opacity-100",
            )}
          >
            <span className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              {value ? format(value, dateFormat) : placeholder}
            </span>

            {/* Right side icon */}
            {hasValue && !disabled ? (
              <span
                role="button"
                onClick={handleClear}
                onMouseDown={(e) => e.preventDefault()}
                className="hover:bg-muted cursor-pointer rounded-sm p-0.5 -mr-0.5"
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
            mode="single"
            selected={value}
            onSelect={handleSelect}
            defaultMonth={value || parsedMinDate}
            disabled={disabledDays}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ComponentCustomDatePicker;
