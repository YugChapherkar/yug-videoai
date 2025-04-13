import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Instagram, Youtube } from "lucide-react";

interface GeneratedShort {
  url: string;
  platform: string;
  thumbnail: string;
}

interface GeneratedShortsGridProps {
  shorts: GeneratedShort[];
  onDownload: (short: GeneratedShort) => void;
  onShare: (short: GeneratedShort) => void;
}

const GeneratedShortsGrid = ({
  shorts,
  onDownload,
  onShare,
}: GeneratedShortsGridProps) => {
  if (shorts.length === 0) {
    return null;
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      case "tiktok":
        return (
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return "Instagram Reel";
      case "youtube":
        return "YouTube Short";
      case "tiktok":
        return "TikTok";
      default:
        return platform;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Generated Short-Form Videos</h3>
        <Button variant="outline" size="sm">
          Download All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {shorts.map((short, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="relative aspect-[9/16] bg-gray-100">
              <img
                src={short.thumbnail}
                alt={`Short ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                {getPlatformIcon(short.platform)}
                <span>{getPlatformName(short.platform)}</span>
              </div>
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                Short #{index + 1}
              </div>
            </div>
            <CardContent className="p-3">
              <div className="flex justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => onDownload(short)}
                >
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => onShare(short)}
                >
                  <Share2 className="h-4 w-4 mr-1" /> Share
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GeneratedShortsGrid;
