"use client";

import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
}

interface ToastState {
  toasts: Toast[];
}

let toastCount = 0;

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return toastCount.toString();
}

// Simple console-based toast for now (can be upgraded to UI component later)
export function useToast() {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  const toast = useCallback(
    ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
      const id = genId();
      const newToast = { id, title, description, variant };

      // Log to console for debugging
      if (variant === "destructive") {
        console.error(`[Toast] ${title}: ${description}`);
      } else {
        console.log(`[Toast] ${title}: ${description}`);
      }

      setState((prev) => ({
        toasts: [...prev.toasts, newToast],
      }));

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setState((prev) => ({
          toasts: prev.toasts.filter((t) => t.id !== id),
        }));
      }, 5000);

      return { id, dismiss: () => {} };
    },
    []
  );

  return {
    toast,
    toasts: state.toasts,
    dismiss: (toastId?: string) => {
      setState((prev) => ({
        toasts: toastId
          ? prev.toasts.filter((t) => t.id !== toastId)
          : [],
      }));
    },
  };
}
