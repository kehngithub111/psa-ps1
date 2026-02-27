"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import {
  ChevronDownIcon,
  XIcon,
  CheckIcon,
  SearchIcon,
  Loader2Icon,
} from "lucide-react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
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

// Helper to check if value is empty
const isEmptyValue = (val: unknown): boolean => {
  if (val === undefined || val === null) return true;
  if (val === "") return true;
  if (Array.isArray(val) && val.length === 0) return true;
  return false;
};

// Option type
export interface SelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  group?: string;
}

// Group type
export interface SelectGroup {
  label: string;
  options: SelectOption[];
}

interface SelectInternalProps<T = string> {
  value: T | T[] | undefined;
  onChange: (value: T | T[] | undefined) => void;
  onClear?: () => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  showClearButton?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  maxDisplayItems?: number;
}

function SelectInternal<T extends string | number = string>({
  value,
  onChange,
  onClear,
  options,
  placeholder = "Select an option",
  disabled,
  multiple = false,
  searchable = false,
  searchPlaceholder = "Search...",
  showClearButton = false,
  loading = false,
  emptyMessage = "No options found",
  maxDisplayItems = 3,
}: SelectInternalProps<T>) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Filter options based on search
  const filteredOptions = React.useMemo(() => {
    if (!search) return options;
    const searchLower = search.toLowerCase();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(searchLower) ||
        opt.description?.toLowerCase().includes(searchLower),
    );
  }, [options, search]);

  // Group options if they have group property
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, SelectOption<T>[]> = {};
    const ungrouped: SelectOption<T>[] = [];

    filteredOptions.forEach((opt) => {
      if (opt.group) {
        if (!groups[opt.group]) groups[opt.group] = [];
        groups[opt.group].push(opt);
      } else {
        ungrouped.push(opt);
      }
    });

    return { groups, ungrouped };
  }, [filteredOptions]);

  const hasGroups = Object.keys(groupedOptions.groups).length > 0;

  // ✅ Fixed: Proper empty check
  const hasValue = React.useMemo(() => {
    if (isEmptyValue(value)) return false;
    if (multiple && Array.isArray(value)) {
      return value.length > 0;
    }
    return true;
  }, [value, multiple]);

  // ✅ Fixed: Get selected labels for display
  const selectedLabel = React.useMemo(() => {
    if (isEmptyValue(value)) return null;

    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return null;
      const selectedOptions = options.filter((opt) =>
        (value as T[]).includes(opt.value),
      );
      if (selectedOptions.length === 0) return null;
      if (selectedOptions.length <= maxDisplayItems) {
        return selectedOptions.map((opt) => opt.label).join(", ");
      }
      return `${selectedOptions.length} selected`;
    }

    const option = options.find((opt) => opt.value === value);
    return option?.label ?? null;
  }, [value, options, multiple, maxDisplayItems]);

  // ✅ Fixed: Check if value is selected
  const isSelected = (optionValue: T): boolean => {
    if (isEmptyValue(value)) return false;
    if (multiple && Array.isArray(value)) {
      return (value as T[]).includes(optionValue);
    }
    return value === optionValue;
  };

  // Handle option select
  const handleSelect = (option: SelectOption<T>) => {
    if (option.disabled) return;

    if (multiple) {
      const currentValues = (Array.isArray(value) ? value : []) as T[];
      const newValues = isSelected(option.value)
        ? currentValues.filter((v) => v !== option.value)
        : [...currentValues, option.value];
      onChange(newValues.length > 0 ? newValues : undefined);
    } else {
      onChange(option.value);
      setOpen(false);
    }
    setSearch("");
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClear?.();
  };

  // Reset search when closing
  React.useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled || loading}
          data-empty={!hasValue}
          className={cn(
            "w-full justify-between text-left font-normal p-3",
            "data-[empty=true]:text-muted-foreground",
            "disabled:opacity-100",
          )}
        >
          <span className="flex items-center gap-2 truncate">
            {loading ? (
              <>
                <Loader2Icon className="h-4 w-4 animate-spin text-muted-foreground" />
                Loading...
              </>
            ) : (
              selectedLabel || placeholder
            )}
          </span>

          {/* Right side icon */}
          {showClearButton && hasValue && !disabled && !loading ? (
            <span
              role="button"
              onClick={handleClear}
              onMouseDown={(e) => e.preventDefault()}
              className="hover:bg-muted cursor-pointer rounded-sm p-0.5 -mr-0.5"
            >
              <XIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </span>
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-muted-foreground shrink-0" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width)! p-0"
        align="start"
      >
        {/* Search input */}
        {searchable && (
          <div className="p-2 border-b">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8"
              />
            </div>
          </div>
        )}

        {/* Options list */}
        <div className="max-h-[200px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2Icon className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            <div className="p-1">
              {/* Ungrouped options */}
              {groupedOptions.ungrouped.map((option) => (
                <SelectOptionItem
                  key={String(option.value)}
                  option={option}
                  isSelected={isSelected(option.value)}
                  multiple={multiple}
                  onSelect={() => handleSelect(option)}
                />
              ))}

              {/* Grouped options */}
              {hasGroups &&
                Object.entries(groupedOptions.groups).map(
                  ([groupLabel, groupOptions]) => (
                    <div key={groupLabel}>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                        {groupLabel}
                      </div>
                      {groupOptions.map((option) => (
                        <SelectOptionItem
                          key={String(option.value)}
                          option={option}
                          isSelected={isSelected(option.value)}
                          multiple={multiple}
                          onSelect={() => handleSelect(option)}
                        />
                      ))}
                    </div>
                  ),
                )}
            </div>
          )}
        </div>

        {/* Footer for multiple select */}
        {multiple && hasValue && (
          <div className="border-t p-2 flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {Array.isArray(value) ? value.length : 0} selected
            </span>
            <button
              onClick={() => onChange(undefined)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// Option item component
function SelectOptionItem<T>({
  option,
  isSelected,
  multiple,
  onSelect,
}: {
  option: SelectOption<T>;
  isSelected: boolean;
  multiple: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={option.disabled}
      className={cn(
        "w-full flex items-center gap-2 px-2 py-1.5 text-left text-sm rounded-sm",
        "hover:bg-muted transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isSelected &&
          !multiple &&
          "bg-primary hover:bg-black text-primary-foreground",
        isSelected && multiple && "bg-muted",
      )}
    >
      {/* Checkbox for multiple */}
      {multiple && (
        <div
          className={cn(
            "h-4 w-4 rounded border flex items-center justify-center shrink-0",
            isSelected
              ? "bg-primary border-primary text-primary-foreground"
              : "border-input",
          )}
        >
          {isSelected && <CheckIcon className="h-3 w-3" />}
        </div>
      )}

      {/* Icon */}
      {option.icon && <span className="shrink-0">{option.icon}</span>}

      {/* Label and description */}
      <div className="flex-1 min-w-0">
        <div className="truncate">{option.label}</div>
        {option.description && (
          <div className="text-xs text-muted-foreground truncate">
            {option.description}
          </div>
        )}
      </div>

      {/* Check icon for single select */}
      {!multiple && isSelected && <CheckIcon className="h-4 w-4 shrink-0" />}
    </button>
  );
}

// Base props shared by both variants
interface BaseSelectProps<T = string> {
  label: string;
  options: SelectOption<T>[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  loading?: boolean;
  emptyMessage?: string;
}

// Single select props
interface SingleSelectProps<T = string> extends BaseSelectProps<T> {
  variant?: "single";
  path: PurchaseRequestPath;
  multiple?: false;
}

// Multiple select props
interface MultipleSelectProps<T = string> extends BaseSelectProps<T> {
  variant: "multiple";
  path: PurchaseRequestPath;
  multiple: true;
  maxDisplayItems?: number;
}

type ComponentCustomSelectProps<T = string> =
  | SingleSelectProps<T>
  | MultipleSelectProps<T>;

export function ComponentCustomSelect<T extends string | number = string>(
  props: ComponentCustomSelectProps<T>,
) {
  const {
    label,
    options,
    placeholder = "Select an option",
    required,
    disabled,
    disabledReason,
    className,
    searchable = false,
    searchPlaceholder,
    loading = false,
    emptyMessage,
    path,
  } = props;

  const multiple = props.variant === "multiple";
  const maxDisplayItems =
    props.variant === "multiple" ? props.maxDisplayItems : undefined;

  const setField = useStore((state) => state.setField);

  const rawValue = useStore((state) =>
    getNestedValue(state.purchaseRequest, path),
  ) as T | T[] | undefined;

  const handleChange = (value: T | T[] | undefined) => {
    setField(path, value as never);
  };

  const handleClear = () => {
    setField(path, undefined as never);
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

      {/* Select */}
      <SelectInternal<T>
        value={rawValue}
        onChange={handleChange}
        onClear={handleClear}
        options={options}
        placeholder={placeholder}
        disabled={disabled}
        multiple={multiple}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        showClearButton
        loading={loading}
        emptyMessage={emptyMessage}
        maxDisplayItems={maxDisplayItems}
      />
    </div>
  );
}

export default ComponentCustomSelect;
