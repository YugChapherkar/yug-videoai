import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crop, RotateCw, Scissors, Download, Share2 } from "lucide-react";

interface SimplifiedControlsProps {
  onCropClick: () => void;
  onRotateClick: () => void;
  onTrimClick: () => void;
  onExportClick: () => void;
  onShareClick: () => void;
  isProcessing?: boolean;
}

const SimplifiedControls = ({
  onCropClick,
  onRotateClick,
  onTrimClick,
  onExportClick,
  onShareClick,
  isProcessing = false,
}: SimplifiedControlsProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <h3 className="text-sm font-medium mb-3">Quick Actions</h3>

      <div className="grid grid-cols-5 gap-2">
        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-20 p-2"
          onClick={onCropClick}
          disabled={isProcessing}
        >
          <Crop className="h-6 w-6 mb-1" />
          <span className="text-xs">Crop</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-20 p-2"
          onClick={onRotateClick}
          disabled={isProcessing}
        >
          <RotateCw className="h-6 w-6 mb-1" />
          <span className="text-xs">Rotate</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-20 p-2"
          onClick={onTrimClick}
          disabled={isProcessing}
        >
          <Scissors className="h-6 w-6 mb-1" />
          <span className="text-xs">Trim</span>
        </Button>

        <Button
          variant="outline"
          className="flex flex-col items-center justify-center h-20 p-2"
          onClick={onShareClick}
          disabled={isProcessing}
        >
          <Share2 className="h-6 w-6 mb-1" />
          <span className="text-xs">Share</span>
        </Button>

        <Button
          variant="default"
          className="flex flex-col items-center justify-center h-20 p-2"
          onClick={onExportClick}
          disabled={isProcessing}
        >
          <Download className="h-6 w-6 mb-1" />
          <span className="text-xs">Export</span>
        </Button>
      </div>
    </div>
  );
};

export default SimplifiedControls;
