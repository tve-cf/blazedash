import { Button } from "~/components/ui/button";
import type { ViewMode } from "~/types/analytics";

interface ViewSelectorProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewSelector({ mode, onChange }: ViewSelectorProps) {
  return (
    <div className="flex gap-2">
      <Button
        variant={mode === "general" ? "default" : "outline"}
        onClick={() => onChange("general")}
      >
        General View
      </Button>
      <Button
        variant={mode === "comparison" ? "default" : "outline"}
        onClick={() => onChange("comparison")}
      >
        Comparison View
      </Button>
    </div>
  );
}
