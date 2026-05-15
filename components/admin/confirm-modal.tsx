"use client";

import { AlertTriangle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
}

export function ConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} className="max-w-sm">
      <div className="px-5 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-500/15 text-red-300">
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold">{title}</h2>
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 border-t border-white/10 px-5 py-3">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onOpenChange(false);
          }}
          className="rounded-md bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-red-500"
        >
          {confirmLabel}
        </button>
      </div>
    </Dialog>
  );
}
