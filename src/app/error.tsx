"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div className="text-destructive bg-destructive/10 flex size-12 items-center justify-center rounded-2xl">
        <AlertTriangle className="size-6" />
      </div>
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-balance text-sm">
        An unexpected error occurred. You can try again — your saved personas
        are safe in your browser.
      </p>
      <Button variant="brand" className="mt-6" onClick={reset}>
        <RotateCcw className="size-4" />
        Try again
      </Button>
    </main>
  );
}
