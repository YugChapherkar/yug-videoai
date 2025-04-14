import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Youtube, Instagram, Music, Settings2 } from "lucide-react";

export interface PlatformTabsProps {
  onPlatformChange?: (platform: string) => void;
  onSettingsChange?: (settings: PlatformSettings) => void;
  selectedPlatform?: string;
  settings?: PlatformSettings;
}

export interface PlatformSettings {
  aspectRatio: string;
  resolution: string;
  quality: number;
  autoCaption: boolean;
  aiOptimization?: boolean;
  optimizationPreset?: string;
  customSettings: Record<string, any>;
}

const defaultSettings: Record<string, PlatformSettings> = {
  youtube: {
    aspectRatio: "16:9",
    resolution: "1920x1080",
    quality: 80,
    autoCaption: false,
    aiOptimization: true,
    optimizationPreset: "engagement",
    customSettings: {
      endScreen: true,
      annotations: false,
    },
  },
  instagram: {
    aspectRatio: "1:1",
    resolution: "1080x1080",
    quality: 70,
    autoCaption: true,
    aiOptimization: true,
    optimizationPreset: "aesthetic",
    customSettings: {
      filter: "normal",
      boomerang: false,
    },
  },
  tiktok: {
    aspectRatio: "9:16",
    resolution: "1080x1920",
    quality: 75,
    autoCaption: true,
    aiOptimization: true,
    optimizationPreset: "trending",
    customSettings: {
      addMusic: true,
      effects: "none",
    },
  },
};

const PlatformTabs: React.FC<PlatformTabsProps> = ({
  onPlatformChange = () => {},
  onSettingsChange = () => {},
  selectedPlatform = "youtube",
  settings = defaultSettings.youtube,
}) => {
  const handlePlatformChange = (value: string) => {
    onPlatformChange(value);
    onSettingsChange(defaultSettings[value]);
  };

  const handleQualityChange = (value: number[]) => {
    const newSettings = { ...settings, quality: value[0] };
    onSettingsChange(newSettings);
  };

  const handleCaptionToggle = (checked: boolean) => {
    const newSettings = { ...settings, autoCaption: checked };
    onSettingsChange(newSettings);
  };

  const handleAIOptimizationToggle = (checked: boolean) => {
    const newSettings = { ...settings, aiOptimization: checked };
    onSettingsChange(newSettings);
  };

  const handleOptimizationPresetChange = (preset: string) => {
    const newSettings = { ...settings, optimizationPreset: preset };
    onSettingsChange(newSettings);
  };

  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Settings2 className="mr-2 h-5 w-5" />
          Platform Settings
        </h3>

        <Tabs
          defaultValue={selectedPlatform}
          onValueChange={handlePlatformChange}
          className="w-full"
        >
          <TabsList className="w-full mb-4 grid grid-cols-3">
            <TabsTrigger value="youtube" className="flex items-center">
              <Youtube className="mr-2 h-4 w-4" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center">
              <Instagram className="mr-2 h-4 w-4" />
              Instagram
            </TabsTrigger>
            <TabsTrigger value="tiktok" className="flex items-center">
              <Music className="mr-2 h-4 w-4" />
              TikTok
            </TabsTrigger>
          </TabsList>

          <TabsContent value="youtube" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="font-medium">Aspect Ratio:</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 ml-1 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Standard YouTube aspect ratio</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">
                  {settings.aspectRatio}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Resolution:</span>
                <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">
                  {settings.resolution}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="quality" className="font-medium">
                    Quality:
                  </Label>
                  <span className="text-sm font-bold">{settings.quality}%</span>
                </div>
                <Slider
                  id="quality"
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[settings.quality]}
                  onValueChange={handleQualityChange}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="auto-caption" className="font-medium">
                    Auto Caption:
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Automatically generate captions using AI</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  id="auto-caption"
                  checked={settings.autoCaption}
                  onCheckedChange={handleCaptionToggle}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="ai-optimization" className="font-medium">
                    AI Optimization:
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Use AI to optimize content for YouTube algorithms</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  id="ai-optimization"
                  checked={settings.aiOptimization}
                  onCheckedChange={handleAIOptimizationToggle}
                />
              </div>

              {settings.aiOptimization && (
                <div className="space-y-2">
                  <Label
                    htmlFor="optimization-preset"
                    className="text-sm font-medium"
                  >
                    Optimization Preset:
                  </Label>
                  <select
                    id="optimization-preset"
                    className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                    value={settings.optimizationPreset}
                    onChange={(e) =>
                      handleOptimizationPresetChange(e.target.value)
                    }
                  >
                    <option value="engagement">Maximize Engagement</option>
                    <option value="retention">Viewer Retention</option>
                    <option value="growth">Channel Growth</option>
                    <option value="monetization">Monetization</option>
                  </select>
                </div>
              )}

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Advanced Settings</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="end-screen"
                      checked={settings.customSettings.endScreen}
                    />
                    <Label htmlFor="end-screen">End Screen</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="annotations"
                      checked={settings.customSettings.annotations}
                    />
                    <Label htmlFor="annotations">Annotations</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="instagram" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Aspect Ratio:</span>
                <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">
                  {settings.aspectRatio}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Resolution:</span>
                <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">
                  {settings.resolution}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="quality-ig" className="font-medium">
                    Quality:
                  </Label>
                  <span className="text-sm font-bold">{settings.quality}%</span>
                </div>
                <Slider
                  id="quality-ig"
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[settings.quality]}
                  onValueChange={handleQualityChange}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-caption-ig" className="font-medium">
                  Auto Caption:
                </Label>
                <Switch
                  id="auto-caption-ig"
                  checked={settings.autoCaption}
                  onCheckedChange={handleCaptionToggle}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="ai-optimization-ig" className="font-medium">
                    AI Optimization:
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Use AI to optimize content for Instagram's algorithm
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  id="ai-optimization-ig"
                  checked={settings.aiOptimization}
                  onCheckedChange={handleAIOptimizationToggle}
                />
              </div>

              {settings.aiOptimization && (
                <div className="space-y-2">
                  <Label
                    htmlFor="optimization-preset-ig"
                    className="text-sm font-medium"
                  >
                    Optimization Preset:
                  </Label>
                  <select
                    id="optimization-preset-ig"
                    className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                    value={settings.optimizationPreset}
                    onChange={(e) =>
                      handleOptimizationPresetChange(e.target.value)
                    }
                  >
                    <option value="aesthetic">Aesthetic Feed</option>
                    <option value="engagement">Engagement Boost</option>
                    <option value="discovery">Discovery Optimization</option>
                    <option value="shopping">Shopping Conversion</option>
                  </select>
                </div>
              )}

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Instagram Options</h4>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="filter">Filter:</Label>
                    <select
                      id="filter"
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm"
                      defaultValue={settings.customSettings.filter}
                    >
                      <option value="normal">Normal</option>
                      <option value="clarendon">Clarendon</option>
                      <option value="gingham">Gingham</option>
                      <option value="moon">Moon</option>
                      <option value="lark">Lark</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="boomerang"
                      checked={settings.customSettings.boomerang}
                    />
                    <Label htmlFor="boomerang">Boomerang Effect</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tiktok" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Aspect Ratio:</span>
                <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">
                  {settings.aspectRatio}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Resolution:</span>
                <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full">
                  {settings.resolution}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="quality-tt" className="font-medium">
                    Quality:
                  </Label>
                  <span className="text-sm font-bold">{settings.quality}%</span>
                </div>
                <Slider
                  id="quality-tt"
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[settings.quality]}
                  onValueChange={handleQualityChange}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="auto-caption-tt" className="font-medium">
                  Auto Caption:
                </Label>
                <Switch
                  id="auto-caption-tt"
                  checked={settings.autoCaption}
                  onCheckedChange={handleCaptionToggle}
                />
              </div>

              <div className="flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="ai-optimization-tt" className="font-medium">
                    AI Optimization:
                  </Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-gray-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Use AI to optimize content for TikTok's For You Page
                          algorithm
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Switch
                  id="ai-optimization-tt"
                  checked={settings.aiOptimization}
                  onCheckedChange={handleAIOptimizationToggle}
                />
              </div>

              {settings.aiOptimization && (
                <div className="space-y-2">
                  <Label
                    htmlFor="optimization-preset-tt"
                    className="text-sm font-medium"
                  >
                    Optimization Preset:
                  </Label>
                  <select
                    id="optimization-preset-tt"
                    className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                    value={settings.optimizationPreset}
                    onChange={(e) =>
                      handleOptimizationPresetChange(e.target.value)
                    }
                  >
                    <option value="trending">Trending Topics</option>
                    <option value="viral">Viral Potential</option>
                    <option value="fyp">FYP Algorithm</option>
                    <option value="niche">Niche Community</option>
                  </select>
                </div>
              )}

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">TikTok Options</h4>
                <div className="grid gap-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="add-music"
                      checked={settings.customSettings.addMusic}
                    />
                    <Label htmlFor="add-music">Add Background Music</Label>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="effects">Effects:</Label>
                    <select
                      id="effects"
                      className="rounded-md border border-gray-300 px-3 py-1 text-sm"
                      defaultValue={settings.customSettings.effects}
                    >
                      <option value="none">None</option>
                      <option value="zoom">Zoom</option>
                      <option value="glitch">Glitch</option>
                      <option value="vhs">VHS</option>
                      <option value="retro">Retro</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button className="w-full" variant="outline">
            Apply Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlatformTabs;
