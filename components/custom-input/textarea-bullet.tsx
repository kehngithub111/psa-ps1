"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Info, List } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { PathValue, PurchaseRequestPath } from "@/stores/paths";
import { PurchaseRequest } from "@/stores/types";
import useStore from "@/stores/global-state";

// ============================================
// Helpers
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
// Bullet Styles
// ============================================

const BULLET_STYLES = {
  bullet: "•",
  dash: "—",
  arrow: "→",
  check: "✓",
  star: "★",
  circle: "○",
  square: "▪",
  number: "number",
  none: "",
} as const;

type BulletStyle = keyof typeof BULLET_STYLES;

const getBullet = (style: BulletStyle, index: number): string => {
  if (style === "none") return "";
  if (style === "number") return `${index + 1}.`;
  return BULLET_STYLES[style];
};

// ============================================
// Sync Hook (Prevents infinite loop)
// ============================================

function useSyncedLocalText(value: string[]) {
  const [localText, setLocalText] = React.useState(() => value.join("\n"));
  const isInternalChange = React.useRef(false);

  React.useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    setLocalText(value.join("\n"));
  }, [value]);

  const updateText = (newText: string) => {
    setLocalText(newText);
    isInternalChange.current = true;
  };

  return { localText, setLocalText: updateText, isInternalChange };
}

// ============================================
// Component Props
// ============================================

interface ComponentCustomBulletedTextareaProps {
  label: string;
  path: PurchaseRequestPath;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
  bulletStyle?: BulletStyle;
  minRows?: number;
  maxRows?: number;
  maxItems?: number;
  showItemCount?: boolean;
  showHelper?: boolean;
}

// ============================================
// Main Component
// ============================================

export function ComponentCustomBulletedTextarea({
  label,
  path,
  placeholder = "Type here... Each line will be saved as a separate item.",
  required,
  disabled,
  disabledReason,
  className,
  bulletStyle = "bullet",
  minRows = 3,
  maxRows = 10,
  maxItems,
  showItemCount = true,
  showHelper = true,
}: ComponentCustomBulletedTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = React.useState(false);

  // Store
  const setField = useStore((state) => state.setField);
  const rawValue = useStore((state) =>
    getNestedValue(state.purchaseRequest, path),
  ) as string[] | undefined;

  const value = React.useMemo(() => {
    return Array.isArray(rawValue) ? rawValue : [];
  }, [rawValue]);

  // Synced local state
  const { localText, setLocalText, isInternalChange } =
    useSyncedLocalText(value);

  // Handlers
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    const lines = newText.split("\n");

    // Respect maxItems
    if (maxItems && lines.filter((l) => l.trim()).length > maxItems) {
      return;
    }

    setLocalText(newText);
    setField(path, lines as never);
  };

  const handleBlur = () => {
    setIsFocused(false);

    // Clean up empty lines on blur
    const cleaned = localText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    isInternalChange.current = true;
    setLocalText(cleaned.join("\n"));
    setField(path, cleaned as never);
  };

  // Computed
  const lines = localText.split("\n");
  const lineCount = lines.length;
  const itemCount = lines.filter((line) => line.trim()).length;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* Label */}
      {label && (
        <div className="flex items-center gap-1">
          <Label htmlFor={path} className="flex items-center">
            {label}
            {required && !disabled && (
              <span className="text-red-500 ml-0.5">*</span>
            )}
          </Label>
          {disabled && disabledReason && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="size-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{disabledReason}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}

      {/* Textarea Container */}
      <div
        className={cn(
          "relative rounded-md border bg-background overflow-hidden transition-all duration-200",
          isFocused && "ring-2 ring-ring ring-offset-2 ring-offset-background",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <div className="flex">
          {/* Bullet Column */}
          {bulletStyle !== "none" && (
            <div
              className={cn(
                "flex flex-col py-2 pl-3 pr-2 bg-muted/40 border-r select-none",
                "text-muted-foreground text-sm",
              )}
            >
              {Array.from({ length: Math.max(lineCount, minRows) }).map(
                (_, index) => (
                  <div
                    key={index}
                    className="h-6 flex items-center justify-center min-w-[16px] leading-6"
                  >
                    {index < lineCount ? getBullet(bulletStyle, index) : ""}
                  </div>
                ),
              )}
            </div>
          )}

          {/* Textarea */}
          <Textarea
            ref={textareaRef}
            id={path}
            value={localText}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder={placeholder}
            rows={minRows}
            className={cn(
              "flex-1 resize-none border-0 rounded-none shadow-none",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              "min-h-0 py-2 px-3 leading-6",
            )}
          />
        </div>

        {/* Footer */}
        {(showHelper || showItemCount) && (
          <div className="flex items-center justify-between px-3 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
            {showHelper && (
              <div className="flex items-center gap-1.5">
                <List className="size-3.5" />
                <span>Each line = separate item</span>
              </div>
            )}
            {showItemCount && (
              <span className="ml-auto">
                {itemCount} {itemCount === 1 ? "item" : "items"}
                {maxItems && (
                  <span className="text-muted-foreground/60">
                    {" "}
                    / {maxItems}
                  </span>
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ComponentCustomBulletedTextarea;
