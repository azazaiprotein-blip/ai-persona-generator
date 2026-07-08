"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Bookmark,
  BookmarkCheck,
  Brain,
  Braces,
  Compass,
  Download,
  FileText,
  FileType,
  FileImage,
  Gauge,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Package,
  Palette,
  Rocket,
  Sparkles,
  Target,
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
import { cn } from "@/lib/utils";
import {
  copyToClipboard,
  downloadText,
  exportNodeAsImage,
  exportNodeAsPdf,
  projectToJson,
  projectToMarkdown,
  slugify,
} from "@/lib/export";
import type { Project } from "@/lib/types";
import { PersonaSwitcher } from "./primitives";
import { PersonaChat } from "./PersonaChat";
import {
  DesignSection,
  EmpathyMapSection,
  FeaturesSection,
  JourneyMapSection,
  JtbdSection,
  MarketingSection,
  OpportunitiesSection,
  OverviewSection,
  PersonasSection,
  ProductSection,
  UserStoriesSection,
} from "./sections";

type TabId =
  | "overview"
  | "personas"
  | "empathy"
  | "journey"
  | "jtbd"
  | "opportunities"
  | "features"
  | "stories"
  | "product"
  | "marketing"
  | "design"
  | "chat";

const TABS: { id: TabId; label: string; icon: typeof Gauge; perPersona?: boolean }[] = [
  { id: "overview", label: "Overview", icon: Gauge },
  { id: "personas", label: "Personas", icon: Sparkles },
  { id: "empathy", label: "Empathy Map", icon: Brain, perPersona: true },
  { id: "journey", label: "Journey Map", icon: Activity, perPersona: true },
  { id: "jtbd", label: "Jobs to be Done", icon: Compass, perPersona: true },
  { id: "opportunities", label: "Opportunities", icon: Lightbulb },
  { id: "features", label: "Features", icon: Target },
  { id: "stories", label: "User Stories", icon: Rocket },
  { id: "product", label: "Product", icon: Package },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "design", label: "Design", icon: Palette },
  { id: "chat", label: "Chat", icon: MessageCircle, perPersona: true },
];

interface ResearchWorkspaceProps {
  project: Project;
  isSaved: boolean;
  onSave: () => void;
}

export function ResearchWorkspace({
  project,
  isSaved,
  onSave,
}: ResearchWorkspaceProps) {
  const [tab, setTab] = useState<TabId>("overview");
  const [activePersonaId, setActivePersonaId] = useState(project.personas[0]?.id);
  const contentRef = useRef<HTMLDivElement>(null);
  const slug = slugify(project.name);

  const activePersona =
    project.personas.find((p) => p.id === activePersonaId) ?? project.personas[0];
  const activeTab = TABS.find((t) => t.id === tab)!;

  async function exportImage(format: "png" | "jpeg") {
    if (!contentRef.current) return;
    await toast.promise(
      exportNodeAsImage(contentRef.current, `${slug}-${tab}.${format}`, format),
      { loading: `Rendering ${format.toUpperCase()}…`, success: `Downloaded ${format.toUpperCase()}`, error: "Export failed" },
    );
  }
  async function exportPdf() {
    if (!contentRef.current) return;
    await toast.promise(exportNodeAsPdf(contentRef.current, `${slug}-${tab}.pdf`), {
      loading: "Rendering PDF…",
      success: "Downloaded PDF",
      error: "Export failed",
    });
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="bg-brand text-brand-foreground flex size-9 items-center justify-center rounded-xl shadow-sm">
            <Package className="size-4.5" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight">{project.name}</h2>
            <p className="text-muted-foreground text-xs">
              Research package · {project.source === "ai" ? "Claude" : "built-in engine"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="size-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Copy</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={async () => {
                  await copyToClipboard(projectToJson(project));
                  toast.success("Copied JSON to clipboard");
                }}
              >
                <Braces />
                Copy JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={async () => {
                  await copyToClipboard(projectToMarkdown(project));
                  toast.success("Copied Markdown to clipboard");
                }}
              >
                <FileText />
                Copy Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Download package</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  downloadText(`${slug}.md`, projectToMarkdown(project), "text/markdown")
                }
              >
                <FileText />
                Markdown file
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  downloadText(`${slug}.json`, projectToJson(project), "application/json")
                }
              >
                <Braces />
                JSON file
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Current view</DropdownMenuLabel>
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
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={isSaved ? "outline" : "brand"}
            size="sm"
            onClick={onSave}
            className={cn(!isSaved && "shadow-brand")}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="size-4" />
                Saved
              </>
            ) : (
              <>
                <Bookmark className="size-4" />
                Save project
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tab strip */}
      <div className="border-border/60 -mx-1 mb-6 flex gap-1 overflow-x-auto border-b px-1 pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative flex shrink-0 items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="size-4" />
              {t.label}
              {active && (
                <motion.span
                  layoutId="workspace-underline"
                  className="bg-brand absolute inset-x-2 -bottom-px h-0.5 rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Per-persona selector */}
      {activeTab.perPersona && project.personas.length > 1 && (
        <div className="mb-4">
          <PersonaSwitcher
            personas={project.personas}
            activeId={activePersona.id}
            onSelect={setActivePersonaId}
          />
        </div>
      )}

      {/* Active section */}
      <div ref={contentRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab + (activeTab.perPersona ? activePersona.id : "")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {tab === "overview" && <OverviewSection project={project} />}
            {tab === "personas" && <PersonasSection project={project} />}
            {tab === "empathy" && (
              <>
                <SectionTitle icon={<Brain className="size-5" />} title="Empathy map" desc={`What ${activePersona.name.split(" ")[0]} thinks, feels, says, and does.`} />
                <EmpathyMapSection persona={activePersona} />
              </>
            )}
            {tab === "journey" && (
              <>
                <SectionTitle icon={<Activity className="size-5" />} title="User journey map" desc="Six stages from awareness to retention, with goals, emotions, pains, and opportunities." />
                <JourneyMapSection persona={activePersona} />
              </>
            )}
            {tab === "jtbd" && (
              <>
                <SectionTitle icon={<Compass className="size-5" />} title="Jobs to be done" desc="Functional, social, emotional, and consumption jobs." />
                <JtbdSection persona={activePersona} />
              </>
            )}
            {tab === "opportunities" && <OpportunitiesSection artifacts={project.artifacts} />}
            {tab === "features" && <FeaturesSection artifacts={project.artifacts} />}
            {tab === "stories" && <UserStoriesSection artifacts={project.artifacts} />}
            {tab === "product" && <ProductSection artifacts={project.artifacts} />}
            {tab === "marketing" && <MarketingSection artifacts={project.artifacts} />}
            {tab === "design" && <DesignSection artifacts={project.artifacts} />}
            {tab === "chat" && (
              <>
                <SectionTitle icon={<MessageCircle className="size-5" />} title="Chat with persona" desc="Interview your persona — they answer in character." />
                <PersonaChat persona={activePersona} />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <span className="bg-brand-subtle text-brand mt-0.5 flex size-9 items-center justify-center rounded-xl">
        {icon}
      </span>
      <div>
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">{desc}</p>
      </div>
    </div>
  );
}
