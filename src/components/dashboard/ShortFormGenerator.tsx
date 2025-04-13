import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Scissors,
  Clock,
  Instagram,
  Youtube,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import TrendingHashtagSuggestions from "./TrendingHashtagSuggestions";

interface ShortFormGeneratorProps {
  videoSrc?: string;
  videoName?: string;
  onGenerateShorts: (settings: ShortFormSettings) => Promise<void>;
  isProcessing?: boolean;
}

export interface ShortFormSettings {
  clipDuration: number;
  clipCount: number;
  platforms: string[];
  addCaptions: boolean;
  addIntro: boolean;
  addOutro: boolean;
  hashtags?: string[];
  optimizeForViral?: boolean;
}

const ShortFormGenerator = ({
  videoSrc = "",
  videoName = "",
  onGenerateShorts,
  isProcessing = false,
}: ShortFormGeneratorProps) => {
  const [settings, setSettings] = useState<ShortFormSettings>({
    clipDuration: 30,
    clipCount: 3,
    platforms: ["instagram", "youtube"],
    addCaptions: true,
    addIntro: false,
    addOutro: false,
    hashtags: [],
    optimizeForViral: true,
  });

  const [progress, setProgress] = useState(0);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  const handlePlatformToggle = (platform: string) => {
    setSettings((prev) => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms };
    });
  };

  const handleHashtagSelect = (hashtag: string) => {
    setSelectedHashtags((prev) => {
      if (prev.includes(hashtag)) {
        return prev.filter((tag) => tag !== hashtag);
      } else {
        return [...prev, hashtag];
      }
    });

    setSettings((prev) => ({
      ...prev,
      hashtags: selectedHashtags.includes(hashtag)
        ? prev.hashtags?.filter((tag) => tag !== hashtag)
        : [...(prev.hashtags || []), hashtag],
    }));
  };

  const handleGenerate = async () => {
    // Mock progress updates
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(Math.min(currentProgress, 95));
      if (currentProgress >= 95) clearInterval(interval);
    }, 500);

    try {
      // Include selected hashtags in the settings
      const settingsWithHashtags = {
        ...settings,
        hashtags: selectedHashtags,
      };
      await onGenerateShorts(settingsWithHashtags);
      setProgress(100);
    } catch (error) {
      console.error("Error generating shorts:", error);
    } finally {
      clearInterval(interval);
    }
  };

  // Get the active platform for hashtag suggestions
  const getActivePlatform = () => {
    if (settings.platforms.length === 1) {
      return settings.platforms[0];
    } else {
      return "all";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Scissors className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Short-Form Video Generator</h2>
      </div>

      {!videoSrc ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500">
            Upload or import a YouTube video first to generate short-form
            content
          </p>
        </div>
      ) : isProcessing ? (
        <div className="space-y-4 py-6">
          <div className="flex justify-center">
            <RefreshCw className="h-10 w-10 text-primary animate-spin" />
          </div>
          <p className="text-center font-medium">
            Generating short-form videos...
          </p>
          <Progress value={progress} className="h-2" />
          <p className="text-center text-sm text-gray-500">
            {progress}% complete
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {videoName && (
            <div className="bg-muted/30 p-3 rounded-md">
              <p className="text-sm">
                Source: <span className="font-medium">{videoName}</span>
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Clip Duration (seconds)</Label>
                <span className="text-sm font-medium">
                  {settings.clipDuration}s
                </span>
              </div>
              <Slider
                value={[settings.clipDuration]}
                min={15}
                max={60}
                step={5}
                onValueChange={(values) =>
                  setSettings({ ...settings, clipDuration: values[0] })
                }
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>15s</span>
                <span>30s</span>
                <span>60s</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label>Number of Clips</Label>
                <span className="text-sm font-medium">
                  {settings.clipCount}
                </span>
              </div>
              <Slider
                value={[settings.clipCount]}
                min={1}
                max={10}
                step={1}
                onValueChange={(values) =>
                  setSettings({ ...settings, clipCount: values[0] })
                }
              />
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Target Platforms</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={
                    settings.platforms.includes("instagram")
                      ? "default"
                      : "outline"
                  }
                  className="flex items-center gap-2"
                  onClick={() => handlePlatformToggle("instagram")}
                >
                  <Instagram className="h-4 w-4" />
                  Instagram Reels
                </Button>
                <Button
                  type="button"
                  variant={
                    settings.platforms.includes("youtube")
                      ? "default"
                      : "outline"
                  }
                  className="flex items-center gap-2"
                  onClick={() => handlePlatformToggle("youtube")}
                >
                  <Youtube className="h-4 w-4" />
                  YouTube Shorts
                </Button>
                <Button
                  type="button"
                  variant={
                    settings.platforms.includes("tiktok")
                      ? "default"
                      : "outline"
                  }
                  className="flex items-center gap-2"
                  onClick={() => handlePlatformToggle("tiktok")}
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                  TikTok
                </Button>
              </div>
            </div>

            {/* Trending Hashtag Suggestions */}
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <TrendingHashtagSuggestions
                platform={getActivePlatform()}
                videoContent={videoName}
                onHashtagSelect={handleHashtagSelect}
              />
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="optimize-viral"
                  checked={settings.optimizeForViral}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      optimizeForViral: checked === true,
                    })
                  }
                />
                <Label htmlFor="optimize-viral" className="flex items-center">
                  <span>Optimize for viral potential</span>
                  <Sparkles className="ml-1 h-3 w-3 text-yellow-500" />
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="add-captions"
                  checked={settings.addCaptions}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, addCaptions: checked === true })
                  }
                />
                <Label htmlFor="add-captions">Auto-generate captions</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="add-intro"
                  checked={settings.addIntro}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, addIntro: checked === true })
                  }
                />
                <Label htmlFor="add-intro">Add intro animation</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="add-outro"
                  checked={settings.addOutro}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, addOutro: checked === true })
                  }
                />
                <Label htmlFor="add-outro">Add outro with call-to-action</Label>
              </div>
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={handleGenerate}
            disabled={!videoSrc || settings.platforms.length === 0}
          >
            <Scissors className="mr-2 h-4 w-4" />
            Generate {settings.clipCount} Short-Form Videos
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShortFormGenerator;
