import { History, RotateCcw, X, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HistoryEntry {
  id: string;
  originalPrompt: string;
  platform: string;
  score: number;
  timestamp: number;
}

interface OptimizationHistoryProps {
  entries: HistoryEntry[];
  isOpen: boolean;
  onToggle: () => void;
  onReuse: (prompt: string) => void;
}

export const OptimizationHistory = ({ entries, isOpen, onToggle, onReuse }: OptimizationHistoryProps) => {
  if (entries.length === 0 && !isOpen) return null;

  return (
    <>
      {/* Toggle button - always visible */}
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-primary text-primary-foreground p-2 rounded-l-lg shadow-lg hover:bg-primary/90 transition-all"
        aria-label="Toggle optimization history"
      >
        {isOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        {!isOpen && entries.length > 0 && (
          <span className="absolute -top-1 -left-1 w-4 h-4 bg-accent text-[10px] font-bold rounded-full flex items-center justify-center text-white">
            {entries.length}
          </span>
        )}
      </button>

      {/* Sidebar panel */}
      <div
        className={`fixed right-0 top-0 h-full w-72 bg-card border-l border-border shadow-2xl z-30 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            Recent Optimizations
          </h3>
          <button onClick={onToggle} className="p-1 hover:bg-muted rounded">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-80px)]">
          {entries.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No optimizations yet. Your history will appear here.
            </p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="rounded-lg border border-border/50 bg-muted/30 p-3 space-y-2 hover:border-primary/30 transition-colors"
              >
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {entry.originalPrompt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                      {entry.platform}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Score: {entry.score}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-[10px] gap-1"
                    onClick={() => onReuse(entry.originalPrompt)}
                  >
                    <RotateCcw className="h-3 w-3" />
                    Re-use
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground/60">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
