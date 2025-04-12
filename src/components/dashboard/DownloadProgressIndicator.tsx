import React from "react";
import { Progress } from "@/components/ui/progress";
import { RefreshCw, CheckCircle } from "lucide-react";

interface DownloadProgressIndicatorProps {
  progress: number;
  status: string;
  isComplete?: boolean;
}

const DownloadProgressIndicator = ({
  progress,
  status,
  isComplete = false,
}: DownloadProgressIndicatorProps) => {
  // Calculate time remaining (mock implementation)
  const getEstimatedTimeRemaining = () => {
    if (progress >= 100 || isComplete) return "Complete";
    if (progress < 5) return "Calculating...";

    // Mock time calculation based on progress
    const remainingProgress = 100 - progress;
    const secondsPerPercent = 0.3; // Adjust based on average download speed
    const secondsRemaining = Math.round(remainingProgress * secondsPerPercent);

    if (secondsRemaining < 60) {
      return `About ${secondsRemaining} seconds remaining`;
    } else {
      const minutesRemaining = Math.round(secondsRemaining / 60);
      return `About ${minutesRemaining} minute${minutesRemaining > 1 ? "s" : ""} remaining`;
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isComplete ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <RefreshCw className="h-5 w-5 text-primary animate-spin" />
          )}
          <span className="font-medium">{status}</span>
        </div>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>

      <Progress value={progress} className="h-2" />

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          Download speed: {Math.round(150 + Math.random() * 100)} KB/s
        </span>
        <span>{getEstimatedTimeRemaining()}</span>
      </div>
    </div>
  );
};

export default DownloadProgressIndicator;
