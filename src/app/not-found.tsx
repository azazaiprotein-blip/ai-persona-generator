import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

import { Logo } from "@/components/persona/Logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="bg-dots relative flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div className="hero-glow absolute inset-x-0 top-0 h-72" />
      <Logo className="size-12" />
      <p className="text-brand mt-6 text-sm font-semibold tracking-widest">
        404
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        This page went off the map
      </h1>
      <p className="text-muted-foreground mt-2 max-w-sm text-balance">
        The page you&apos;re looking for doesn&apos;t exist — but a fresh
        research package is one click away.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button variant="brand" asChild className="shadow-brand">
          <Link href="/studio">
            <Compass className="size-4" />
            Open Studio
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <ArrowLeft className="size-4" />
            Back home
          </Link>
        </Button>
      </div>
    </main>
  );
}
