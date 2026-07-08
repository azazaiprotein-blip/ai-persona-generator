"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  BookmarkCheck,
  Braces,
  Check,
  Copy,
  Download,
  FileImage,
  FileText,
  FileType,
  Files,
  Heart,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  copyToClipboard,
  downloadText,
  exportNodeAsImage,
  exportNodeAsPdf,
  personaToJson,
  personaToMarkdown,
  slugify,
} from "@/lib/export";
import { cn } from "@/lib/utils";
import type { Persona } from "@/lib/types";

export interface PersonaControls {
  variant: "result" | "saved" | "export";
  saved: boolean;
  favorite: boolean;
  onSave: () => void;
  onRemove: () => void;
  onToggleFavorite: () => void;
  onDuplicate: () => void;
}

interface PersonaCardActionsProps {
  persona: Persona;
  exportRef: React.RefObject<HTMLElement | null>;
  controls: PersonaControls;
}

function IconButton({
  label,
  onClick,
  children,
  className,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClick}
          aria-label={label}
          className={cn("size-8", className)}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function PersonaCardActions({
  persona,
  exportRef,
  controls,
}: PersonaCardActionsProps) {
  const [copied, setCopied] = useState(false);
  const slug = slugify(persona.name);

  async function copyJson() {
    try {
      await copyToClipboard(personaToJson(persona));
      setCopied(true);
      toast.success("Copied JSON to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn't copy");
    }
  }

  async function copyMarkdown() {
    try {
      await copyToClipboard(personaToMarkdown(persona));
      toast.success("Copied Markdown to clipboard");
    } catch {
      toast.error("Couldn't copy");
    }
  }

  async function exportImage(format: "png" | "jpeg") {
    const node = exportRef.current;
    if (!node) return;
    await toast.promise(exportNodeAsImage(node, `${slug}.${format}`, format), {
      loading: `Rendering ${format.toUpperCase()}…`,
      success: `Downloaded ${format.toUpperCase()}`,
      error: "Export failed",
    });
  }

  async function exportPdf() {
    const node = exportRef.current;
    if (!node) return;
    await toast.promise(exportNodeAsPdf(node, `${slug}.pdf`), {
      loading: "Rendering PDF…",
      success: "Downloaded PDF",
      error: "Export failed",
    });
  }

  return (
    <div className="flex items-center gap-0.5" data-noexport="true">
      {controls.variant === "saved" && (
        <IconButton
          label={controls.favorite ? "Unfavorite" : "Favorite"}
          onClick={controls.onToggleFavorite}
          className={controls.favorite ? "text-rose-500" : ""}
        >
          <motion.span
            key={String(controls.favorite)}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 16 }}
          >
            <Heart
              className={cn("size-4", controls.favorite && "fill-rose-500")}
            />
          </motion.span>
        </IconButton>
      )}

      {/* Export menu */}
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Export"
                className="size-8"
              >
                <Download className="size-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>Export</TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Copy</DropdownMenuLabel>
          <DropdownMenuItem onClick={copyJson}>
            {copied ? <Check className="text-emerald-500" /> : <Copy />}
            Copy JSON
          </DropdownMenuItem>
          <DropdownMenuItem onClick={copyMarkdown}>
            <Copy />
            Copy Markdown
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Download</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => exportImage("png")}>
            <FileImage />
            PNG image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => exportImage("jpeg")}>
            <FileImage />
            JPEG image
          </DropdownMenuItem>
          <DropdownMenuItem onClick={exportPdf}>
            <FileType />
            PDF document
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              downloadText(
                `${slug}.md`,
                personaToMarkdown(persona),
                "text/markdown",
              )
            }
          >
            <FileText />
            Markdown file
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              downloadText(
                `${slug}.json`,
                personaToJson(persona),
                "application/json",
              )
            }
          >
            <Braces />
            JSON file
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {controls.variant === "export" ? null : controls.variant === "result" ? (
        <IconButton
          label={controls.saved ? "Saved" : "Save"}
          onClick={() => {
            if (controls.saved) {
              controls.onRemove();
              toast("Removed from saved");
            } else {
              controls.onSave();
              toast.success("Saved persona");
            }
          }}
          className={controls.saved ? "text-brand" : ""}
        >
          <motion.span
            key={String(controls.saved)}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 16 }}
          >
            {controls.saved ? (
              <BookmarkCheck className="size-4 fill-brand/20" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </motion.span>
        </IconButton>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="More actions"
              className="size-8"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                controls.onDuplicate();
                toast.success("Duplicated persona");
              }}
            >
              <Files />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                controls.onRemove();
                toast("Removed from saved");
              }}
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
