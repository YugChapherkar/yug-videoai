import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface VideoQualitySelectorProps {
  selectedQuality: string;
  onQualityChange: (quality: string) => void;
  disabled?: boolean;
}

const VideoQualitySelector = ({
  selectedQuality,
  onQualityChange,
  disabled = false,
}: VideoQualitySelectorProps) => {
  const qualities = [
    { value: "360p", label: "360p (Low)" },
    { value: "480p", label: "480p (Medium)" },
    { value: "720p", label: "720p (High)" },
    { value: "1080p", label: "1080p (Full HD)" },
  ];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Video Quality</label>
      <Select
        value={selectedQuality}
        onValueChange={onQualityChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select quality" />
        </SelectTrigger>
        <SelectContent>
          {qualities.map((quality) => (
            <SelectItem key={quality.value} value={quality.value}>
              {quality.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default VideoQualitySelector;
