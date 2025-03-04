import { cn } from "~/lib/utils";

interface ComingSoonOverlayProps {
  className?: string;
  showDescription?: boolean;
}

export function ComingSoonOverlay({
  className,
  showDescription = true,
}: ComingSoonOverlayProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-background/80",
        className,
      )}
    >
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold tracking-tight">Coming Soon</h3>
        {showDescription && (
          <p className="text-muted-foreground">
            Advanced comparison analytics are under development.
          </p>
        )}
      </div>
    </div>
  );
}
