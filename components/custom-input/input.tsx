"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import useStore, { PurchaseRequest } from "@/stores/global-state";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PathValue, PurchaseRequestPath } from "@/stores/paths";
import { cn } from "@/lib/utils";

// ============================================
// Helper to get nested value
// ============================================

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

// ============================================
// Helper to detect field type from path
// ============================================

type FieldType = "text" | "number" | "currency" | "calculated";

const getFieldTypeFromPath = (path: string): FieldType => {
  const lowerPath = path.toLowerCase();

  if (lowerPath.includes("totalcost")) {
    return "calculated";
  }

  if (lowerPath.includes("unitcost") || lowerPath.includes("cost")) {
    return "currency";
  }

  if (lowerPath.includes("quantity") || lowerPath.includes("qty")) {
    return "number";
  }

  return "text";
};

// ============================================
// Format number with commas
// ============================================

const formatNumber = (value: number | string): string => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "0.00";
  return num.toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

// ============================================
// Component Props
// ============================================

interface ComponentCustomInputProps {
  path: PurchaseRequestPath;
  placeholder?: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
  type?: "text" | "number" | "currency";
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  calculatedValue?: number;
  decimalPlaces?: number; // ✅ New prop for decimal precision
}

// ============================================
// Main Component
// ============================================

export default function ComponentCustomInput({
  label,
  path,
  placeholder,
  required,
  disabled,
  disabledReason,
  className,
  type: typeOverride,
  prefix: prefixOverride,
  suffix,
  min,
  max,
  calculatedValue,
  decimalPlaces = 2, // ✅ Default 2 decimal places
}: ComponentCustomInputProps) {
  const rawValue = useStore((state) =>
    getNestedValue(state.purchaseRequest, path),
  );
  const setField = useStore((state) => state.setField);

  // Determine field type
  const fieldType = typeOverride ?? getFieldTypeFromPath(path);

  // Determine if it's a numeric field
  const isNumeric =
    fieldType === "number" ||
    fieldType === "currency" ||
    fieldType === "calculated";

  // Determine prefix
  const prefix =
    prefixOverride ??
    (fieldType === "currency" || fieldType === "calculated" ? "₱" : undefined);

  // ✅ Local state for free typing (allows "100.", "100.5", etc.)
  const [localValue, setLocalValue] = React.useState<string>("");
  const [isFocused, setIsFocused] = React.useState(false);
  const isInternalChange = React.useRef(false);

  // ✅ Sync local state with store value when not focused
  React.useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    if (!isFocused) {
      if (fieldType === "calculated" && calculatedValue !== undefined) {
        setLocalValue(formatNumber(calculatedValue));
      } else if (
        rawValue === undefined ||
        rawValue === null ||
        rawValue === ""
      ) {
        setLocalValue("");
      } else if (isNumeric && typeof rawValue === "number") {
        // Format with commas when not focused
        if (fieldType === "currency" || fieldType === "calculated") {
          setLocalValue(formatNumber(rawValue));
        } else {
          setLocalValue(rawValue.toString());
        }
      } else {
        setLocalValue(String(rawValue));
      }
    }
  }, [rawValue, calculatedValue, isFocused, fieldType, isNumeric]);

  // ✅ Handle focus - show raw number for easy editing
  const handleFocus = () => {
    setIsFocused(true);

    if (
      isNumeric &&
      rawValue !== undefined &&
      rawValue !== null &&
      rawValue !== ""
    ) {
      // Remove formatting, show raw number
      const numValue =
        typeof rawValue === "number" ? rawValue : parseFloat(String(rawValue));
      if (!isNaN(numValue)) {
        // Show without commas, but with decimals if currency
        if (fieldType === "currency") {
          setLocalValue(numValue.toFixed(decimalPlaces));
        } else {
          setLocalValue(numValue.toString());
        }
      }
    }
  };

  // ✅ Handle blur - format and sync to store
  const handleBlur = () => {
    setIsFocused(false);

    if (isNumeric) {
      const numValue = parseFloat(localValue) || 0;

      // Apply min/max constraints
      let finalValue = numValue;
      if (min !== undefined && numValue < min) finalValue = min;
      if (max !== undefined && numValue > max) finalValue = max;

      isInternalChange.current = true;
      setField(path, finalValue as never);

      // Format for display
      if (fieldType === "currency" || fieldType === "calculated") {
        setLocalValue(formatNumber(finalValue));
      } else {
        setLocalValue(finalValue.toString());
      }
    }
  };

  // ✅ Handle change - allow free typing with decimals
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (isNumeric) {
      // Remove non-numeric characters except decimal point
      let cleanedValue = inputValue.replace(/[^0-9.]/g, "");

      // Prevent multiple decimal points
      const parts = cleanedValue.split(".");
      if (parts.length > 2) {
        cleanedValue = parts[0] + "." + parts.slice(1).join("");
      }

      // ✅ Limit decimal places
      if (parts.length === 2 && parts[1].length > decimalPlaces) {
        cleanedValue = parts[0] + "." + parts[1].slice(0, decimalPlaces);
      }

      // ✅ Update local state immediately (allows "100.", "100.5", etc.)
      setLocalValue(cleanedValue);

      // ✅ Update store with number value (for live calculations)
      const numValue = parseFloat(cleanedValue) || 0;
      isInternalChange.current = true;
      setField(path, numValue as never);
    } else {
      setLocalValue(inputValue);
      setField(path, inputValue as never);
    }
  };

  // Handle keydown for numeric fields
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isNumeric) return;

    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Escape",
      "Enter",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
    ];

    if (allowedKeys.includes(e.key)) return;

    // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (e.ctrlKey || e.metaKey) return;

    // ✅ Allow decimal point (only one)
    if (e.key === ".") {
      if (localValue.includes(".")) {
        e.preventDefault();
      }
      return;
    }

    // Block non-numeric keys
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  // Is this a calculated field?
  const isCalculated = fieldType === "calculated";
  const isDisabled = disabled || isCalculated;

  // ✅ Display value
  const displayValue =
    isCalculated && calculatedValue !== undefined
      ? formatNumber(calculatedValue)
      : localValue;

  return (
    <div className={cn("flex flex-col gap-2 justify-between", className)}>
      {/* Label */}
      <div className="flex items-center gap-1">
        <Label className="flex items-center">
          {label}
          {required && !isDisabled && (
            <span className="text-red-500 ml-0.5">*</span>
          )}
        </Label>
        {isDisabled && disabledReason && (
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-3.5 h-3.5 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{disabledReason}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {isCalculated && (
          <span className="text-xs text-muted-foreground ml-1">
            (Auto-calculated)
          </span>
        )}
      </div>

      {/* Input with prefix/suffix */}
      <div className="relative flex items-center">
        {/* Prefix */}
        {prefix && (
          <div className="absolute left-3 text-muted-foreground text-sm pointer-events-none">
            {prefix}
          </div>
        )}

        <Input
          value={displayValue}
          className={cn(
            "disabled:opacity-100",
            prefix && "pl-8",
            suffix && "pr-12",
            isCalculated && "bg-muted font-medium",
          )}
          placeholder={
            placeholder ?? (fieldType === "currency" ? "0.00" : undefined)
          }
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={isDisabled}
          inputMode={isNumeric ? "decimal" : "text"}
        />

        {/* Suffix */}
        {suffix && (
          <div className="absolute right-3 text-muted-foreground text-sm pointer-events-none">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}
