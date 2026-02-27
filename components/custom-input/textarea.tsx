import { Textarea } from "@/components/ui/textarea";
import useStore, {
  PurchaseRequestPath,
  PurchaseRequest,
  PathValue,
} from "@/stores/global-state";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const getNestedValue = <P extends PurchaseRequestPath>(
  obj: PurchaseRequest,
  path: P,
): PathValue<PurchaseRequest, P> => {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    current = (current as Record<string, unknown>)[key];
  }

  return current as PathValue<PurchaseRequest, P>;
};

interface ComponentCustomTextareaProps {
  path: PurchaseRequestPath;
  placeholder?: string;
  label: string;
  required?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  className?: string;
}

export default function ComponentCustomTextarea({
  label,
  path,
  placeholder,
  required,
  disabled,
  disabledReason,
  rows = 3,
  maxLength,
  showCharCount = false,
  className,
}: ComponentCustomTextareaProps) {
  const value = useStore((state) =>
    getNestedValue(state.purchaseRequest, path),
  );

  const setField = useStore((state) => state.setField);

  const stringValue = (value as string) ?? "";

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
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

        {/* Character count */}
        {showCharCount && maxLength && (
          <span
            className={cn(
              "text-xs text-muted-foreground",
              stringValue.length > maxLength && "text-red-500",
            )}
          >
            {stringValue.length}/{maxLength}
          </span>
        )}
      </div>

      <Textarea
        value={stringValue}
        className="disabled:opacity-100 resize-none"
        placeholder={placeholder}
        onChange={(e) => setField(path, e.target.value as never)}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
      />
    </div>
  );
}
