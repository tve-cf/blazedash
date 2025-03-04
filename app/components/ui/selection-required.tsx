import { AlertCircle } from "lucide-react";

interface SelectionRequiredProps {
  message: string;
}

export function SelectionRequired({ message }: SelectionRequiredProps) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Selection Required</h3>
          <p className="text-sm text-muted-foreground max-w-md">{message}</p>
        </div>
      </div>
    </div>
  );
}
