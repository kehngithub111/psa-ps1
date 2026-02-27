"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { ClockIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useStore, { PurchaseRequest } from "@/stores/global-state";
import { cn } from "@/lib/utils";
import { PathValue, PurchaseRequestPath } from "@/stores/paths";

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

// Convert time string (HH:mm) to Unix timestamp (seconds since midnight)
const timeToUnix = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60;
};

// Convert Unix timestamp (seconds since midnight) to time string (HH:mm)
const unixToTime = (unix: number): string => {
  const hours = Math.floor(unix / 3600);
  const minutes = Math.floor((unix % 3600) / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

// Parse various formats to time string (HH:mm)
const parseToTimeString = (value: unknown): string | undefined => {
  if (value === null || value === undefined) return undefined;

  // Already a time string (HH:mm)
  if (typeof value === "string" && /^\d{2}:\d{2}$/.test(value)) {
    return value;
  }

  // Unix timestamp (number - seconds since midnight)
  if (typeof value === "number") {
    return unixToTime(value);
  }

  // String that might be a number
  if (typeof value === "string") {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      return unixToTime(numValue);
    }
  }

  return undefined;
};

// Generate time options with min/max filtering
const generateTimeOptions = (
  interval: number = 30,
  format: "12h" | "24h" = "12h",
  minTime?: string,
  maxTime?: string,
  excludeTimes?: string[],
): { value: string; label: string; unix: number }[] => {
  const options: { value: string; label: string; unix: number }[] = [];

  const minUnix = minTime ? timeToUnix(minTime) : undefined;
  const maxUnix = maxTime ? timeToUnix(maxTime) : undefined;
  const excludeSet = new Set(excludeTimes || []);

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const value = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      const unix = timeToUnix(value);

      // Skip if in exclude list
      if (excludeSet.has(value)) continue;

      // Skip if below minimum (only if minTime is set)
      if (minUnix !== undefined && unix < minUnix) continue;

      // Skip if above maximum (only if maxTime is set)
      if (maxUnix !== undefined && unix > maxUnix) continue;

      let label: string;
      if (format === "12h") {
        const period = hour >= 12 ? "PM" : "AM";
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        label = `${displayHour}:${minute.toString().padStart(2, "0")} ${period}`;
      } else {
        label = value;
      }

      options.push({ value, label, unix });
    }
  }

  return options;
};

interface TimePickerInternalProps {
  value: string | undefined;
  onChange: (value: string | number | undefined) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
  interval?: number;
  format?: "12h" | "24h";
  storeAsTimestamp?: boolean;
  showClearButton?: boolean;
  minTime?: string;
  maxTime?: string;
  excludeTimes?: string[];
}

function TimePickerInternal({
  value,
  onChange,
  onClear,
  placeholder = "Select time",
  disabled,
  interval = 30,
  format = "12h",
  storeAsTimestamp = false,
  showClearButton = false,
  minTime,
  maxTime,
  excludeTimes,
}: TimePickerInternalProps) {
  const [open, setOpen] = React.useState(false);
  const timeOptions = React.useMemo(
    () => generateTimeOptions(interval, format, minTime, maxTime, excludeTimes),
    [interval, format, minTime, maxTime, excludeTimes],
  );

  const selectedLabel = React.useMemo(() => {
    if (!value) return null;
    const option = timeOptions.find((opt) => opt.value === value);
    return option?.label || value;
  }, [value, timeOptions]);

  const handleSelect = (option: { value: string; unix: number }) => {
    onChange(storeAsTimestamp ? option.unix : option.value);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClear?.();
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          data-empty={!value}
          className={cn(
            "w-full justify-between text-left font-normal p-3",
            "data-[empty=true]:text-muted-foreground",
            "disabled:opacity-100",
          )}
        >
          <span className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
            {selectedLabel || placeholder}
          </span>

          {/* Right side icon */}
          {showClearButton && value && !disabled ? (
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
      <PopoverContent className="w-[140px] p-0" align="start">
        <div className="h-[200px] overflow-y-auto">
          <div className="p-1">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                className={cn(
                  "w-full px-2 py-1.5 text-left text-sm rounded-sm",
                  "hover:bg-muted transition-colors",
                  value === option.value &&
                    "bg-primary text-primary-foreground",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// Base props shared by both variants
interface BaseTimePickerProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  interval?: number;
  format?: "12h" | "24h";
  className?: string;
  storeAsTimestamp?: boolean;
  minTime?: string;
  maxTime?: string;
  excludeTimes?: string[];
}

// Single variant props
interface SingleTimePickerProps extends BaseTimePickerProps {
  variant?: "single";
  path: PurchaseRequestPath;
  startPath?: never;
  endPath?: never;
}

// Range variant props
interface RangeTimePickerProps extends BaseTimePickerProps {
  variant: "range";
  path?: never;
  startPath: PurchaseRequestPath;
  endPath: PurchaseRequestPath;
}

type ComponentCustomTimePickerProps =
  | SingleTimePickerProps
  | RangeTimePickerProps;

export function ComponentCustomTimePicker(
  props: ComponentCustomTimePickerProps,
) {
  const {
    label,
    placeholder = "Select time",
    required,
    disabled,
    disabledReason,
    interval = 30,
    format = "12h",
    className,
    storeAsTimestamp = false,
    variant = "single",
    minTime,
    maxTime,
    excludeTimes,
  } = props;

  const setField = useStore((state) => state.setField);

  // For single variant
  const singlePath = variant === "single" ? props.path : undefined;
  const rawSingleTime = useStore((state) =>
    singlePath ? getNestedValue(state.purchaseRequest, singlePath) : undefined,
  );
  const singleTime = React.useMemo(
    () => parseToTimeString(rawSingleTime),
    [rawSingleTime],
  );

  // For range variant
  const startPath = variant === "range" ? props.startPath : undefined;
  const endPath = variant === "range" ? props.endPath : undefined;

  const rawStartTime = useStore((state) =>
    startPath ? getNestedValue(state.purchaseRequest, startPath) : undefined,
  );
  const rawEndTime = useStore((state) =>
    endPath ? getNestedValue(state.purchaseRequest, endPath) : undefined,
  );

  const startTime = React.useMemo(
    () => parseToTimeString(rawStartTime),
    [rawStartTime],
  );
  const endTime = React.useMemo(
    () => parseToTimeString(rawEndTime),
    [rawEndTime],
  );

  // Handlers for single variant
  const handleSingleChange = (value: string | number | undefined) => {
    if (singlePath) {
      setField(singlePath, value as never);
    }
  };

  const handleSingleClear = () => {
    if (singlePath) {
      setField(singlePath, undefined as never);
    }
  };

  // Handlers for range variant
  const handleStartChange = (value: string | number | undefined) => {
    if (startPath) {
      setField(startPath, value as never);
    }
  };

  const handleEndChange = (value: string | number | undefined) => {
    if (endPath) {
      setField(endPath, value as never);
    }
  };

  const handleStartClear = () => {
    if (startPath) {
      setField(startPath, undefined as never);
    }
  };

  const handleEndClear = () => {
    if (endPath) {
      setField(endPath, undefined as never);
    }
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

      {/* Single Time Picker */}
      {variant === "single" && (
        <TimePickerInternal
          value={singleTime}
          onChange={handleSingleChange}
          onClear={handleSingleClear}
          placeholder={placeholder}
          disabled={disabled}
          interval={interval}
          format={format}
          storeAsTimestamp={storeAsTimestamp}
          showClearButton
          minTime={minTime}
          maxTime={maxTime}
          excludeTimes={excludeTimes}
        />
      )}

      {/* Range Time Picker */}
      {variant === "range" && (
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <TimePickerInternal
              value={startTime}
              onChange={handleStartChange}
              onClear={handleStartClear}
              placeholder="Start time"
              disabled={disabled}
              interval={interval}
              format={format}
              storeAsTimestamp={storeAsTimestamp}
              showClearButton
              minTime={minTime}
              maxTime={endTime ?? maxTime}
              excludeTimes={[
                ...(excludeTimes || []),
                ...(endTime ? [endTime] : []),
              ]}
            />
          </div>

          <div className="flex-1">
            <TimePickerInternal
              value={endTime}
              onChange={handleEndChange}
              onClear={handleEndClear}
              placeholder="End time"
              disabled={disabled}
              interval={interval}
              format={format}
              storeAsTimestamp={storeAsTimestamp}
              showClearButton
              minTime={startTime ?? minTime}
              maxTime={maxTime}
              excludeTimes={[
                ...(excludeTimes || []),
                ...(startTime ? [startTime] : []),
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ComponentCustomTimePicker;
