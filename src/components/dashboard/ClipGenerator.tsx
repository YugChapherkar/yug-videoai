import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Scissors,
  Sparkles,
  Youtube,
  Instagram,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";

// Custom TikTok icon since it's not in lucide-react
const TiktokIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

interface ClipGeneratorProps {
  onClipsGenerated?: (clips: ClipData[]) => void;
}

interface ClipData {
  id: string;
  title: string;
  platform: string;
  duration: number;
  thumbnail: string;
  status: "completed" | "processing" | "failed";
  url: string;
}

const ClipGenerator: React.FC<ClipGeneratorProps> = ({ onClipsGenerated }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generatedClips, setGeneratedClips] = useState<ClipData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    platforms: ["youtube", "instagram", "tiktok"],
    clipCount: 3,
    minDuration: 15,
    maxDuration: 60,
    detectFaces: true,
    detectEmotions: true,
    detectAction: true,
    addCaptions: true,
    addMusic: true,
    optimizeForTrends: true,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSettingChange = (setting: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handlePlatformToggle = (platform: string) => {
    setSettings((prev) => {
      const platforms = [...prev.platforms];
      if (platforms.includes(platform)) {
        return {
          ...prev,
          platforms: platforms.filter((p) => p !== platform),
        };
      } else {
        return {
          ...prev,
          platforms: [...platforms, platform],
        };
      }
    });
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("video", file);

      const response = await api.uploadVideo(file, (progress) => {
        setUploadProgress(progress);
      });

      if (response.data) {
        setIsUploading(false);
        setUploadProgress(100);
      } else {
        throw new Error(response.error || "Upload failed");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setError(error instanceof Error ? error.message : "Upload failed");
      setIsUploading(false);
    }
  };

  const handleGenerateClips = async () => {
    if (!file) return;

    setIsGenerating(true);
    setGenerationProgress(0);
    setError(null);

    try {
      // In a real implementation, we would use the videoId from the upload response
      const videoId = "mock-video-id";

      const params = {
        videoId,
        platforms: settings.platforms,
        clipCount: settings.clipCount,
        minDuration: settings.minDuration,
        maxDuration: settings.maxDuration,
        detectFaces: settings.detectFaces,
        detectEmotions: settings.detectEmotions,
        detectAction: settings.detectAction,
        addCaptions: settings.addCaptions,
        addMusic: settings.addMusic,
        optimizeForTrends: settings.optimizeForTrends,
      };

      const response = await api.generateClips(videoId, params, (progress) => {
        setGenerationProgress(progress);
      });

      if (response.data) {
        setIsGenerating(false);
        setGenerationProgress(100);
        setGeneratedClips(response.data);
        if (onClipsGenerated) {
          onClipsGenerated(response.data);
        }
      } else {
        throw new Error(response.error || "Clip generation failed");
      }
    } catch (error) {
      console.error("Error generating clips:", error);
      setError(error instanceof Error ? error.message : "Generation failed");
      setIsGenerating(false);

      // Fallback to mock data for development/demo purposes
      generateMockClips();
    }
  };

  // Fallback function for development/demo purposes
  const generateMockClips = () => {
    const platforms = settings.platforms;
    const clipCount = settings.clipCount;
    const mockClips: ClipData[] = [];

    for (let i = 0; i < clipCount; i++) {
      const platform = platforms[i % platforms.length];
      mockClips.push({
        id: `clip-${Date.now()}-${i}`,
        title: `Auto-generated clip ${i + 1}`,
        platform,
        duration: Math.floor(
          Math.random() * (settings.maxDuration - settings.minDuration) +
            settings.minDuration,
        ),
        thumbnail: `https://images.unsplash.com/photo-${1570000000000 + i}?w=400&q=80`,
        status: "completed",
        url: "#",
      });
    }

    setGeneratedClips(mockClips);
    if (onClipsGenerated) {
      onClipsGenerated(mockClips);
    }
  };

  // Load any existing clips when component mounts
  useEffect(() => {
    const fetchClips = async () => {
      try {
        // In a real implementation, we would get the videoId from props or context
        const videoId = "mock-video-id";
        const response = await api.getCaptions(videoId);
        if (response.data) {
          // This is a mock implementation since the API doesn't match exactly
          // In a real app, we would have a getClips function in the API
          const mockClips: ClipData[] = [];
          setGeneratedClips(mockClips);
        }
      } catch (error) {
        console.error("Error fetching clips:", error);
      }
    };

    fetchClips();
  }, []);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "tiktok":
        return <TiktokIcon />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "youtube":
        return "bg-red-100 text-red-800";
      case "instagram":
        return "bg-purple-100 text-purple-800";
      case "tiktok":
        return "bg-black text-white";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          AI Clip Generator
        </CardTitle>
        <CardDescription>
          Automatically generate viral-optimized clips from your long-form
          videos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="results" disabled={generatedClips.length === 0}>
              Results
              {generatedClips.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {generatedClips.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-4 pt-4">
            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center">
              {!file ? (
                <>
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Upload your video
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Drag and drop your video file here, or click to browse
                  </p>
                  <Input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="video-upload">
                    <Button as="span">Select Video</Button>
                  </label>
                </>
              ) : (
                <>
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">{file.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFile(null)}
                      >
                        Change
                      </Button>
                    </div>

                    {isUploading ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    ) : (
                      <Button className="w-full" onClick={handleUpload}>
                        Upload Video
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>

            {uploadProgress === 100 && (
              <div className="space-y-4">
                {error ? (
                  <div className="p-4 border rounded-md bg-red-50 text-red-700 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                ) : (
                  <div className="p-4 border rounded-md bg-green-50 text-green-700 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>Upload complete! You can now generate clips.</span>
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleGenerateClips} disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating Clips...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Clips
                      </>
                    )}
                  </Button>
                </div>

                {isGenerating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Analyzing video and generating clips...</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="h-2" />
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6 pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Target Platforms</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={
                    settings.platforms.includes("youtube")
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handlePlatformToggle("youtube")}
                  className="gap-2"
                >
                  <Youtube className="h-4 w-4" />
                  YouTube Shorts
                </Button>
                <Button
                  variant={
                    settings.platforms.includes("instagram")
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handlePlatformToggle("instagram")}
                  className="gap-2"
                >
                  <Instagram className="h-4 w-4" />
                  Instagram Reels
                </Button>
                <Button
                  variant={
                    settings.platforms.includes("tiktok")
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  onClick={() => handlePlatformToggle("tiktok")}
                  className="gap-2"
                >
                  <TiktokIcon />
                  TikTok
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Clip Settings</h3>

              <div className="space-y-2">
                <Label htmlFor="clip-count">
                  Number of Clips: {settings.clipCount}
                </Label>
                <Slider
                  id="clip-count"
                  min={1}
                  max={10}
                  step={1}
                  value={[settings.clipCount]}
                  onValueChange={(value) =>
                    handleSettingChange("clipCount", value[0])
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-duration">
                    Min Duration: {settings.minDuration}s
                  </Label>
                  <Slider
                    id="min-duration"
                    min={5}
                    max={30}
                    step={1}
                    value={[settings.minDuration]}
                    onValueChange={(value) =>
                      handleSettingChange("minDuration", value[0])
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-duration">
                    Max Duration: {settings.maxDuration}s
                  </Label>
                  <Slider
                    id="max-duration"
                    min={settings.minDuration + 5}
                    max={120}
                    step={1}
                    value={[settings.maxDuration]}
                    onValueChange={(value) =>
                      handleSettingChange("maxDuration", value[0])
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">AI Features</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="detect-faces">Face Detection</Label>
                    <p className="text-sm text-muted-foreground">
                      Identify and focus on faces in the video
                    </p>
                  </div>
                  <Switch
                    id="detect-faces"
                    checked={settings.detectFaces}
                    onCheckedChange={(checked) =>
                      handleSettingChange("detectFaces", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="detect-emotions">Emotion Detection</Label>
                    <p className="text-sm text-muted-foreground">
                      Identify emotional moments for more engaging clips
                    </p>
                  </div>
                  <Switch
                    id="detect-emotions"
                    checked={settings.detectEmotions}
                    onCheckedChange={(checked) =>
                      handleSettingChange("detectEmotions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="detect-action">Action Detection</Label>
                    <p className="text-sm text-muted-foreground">
                      Identify high-action moments in the video
                    </p>
                  </div>
                  <Switch
                    id="detect-action"
                    checked={settings.detectAction}
                    onCheckedChange={(checked) =>
                      handleSettingChange("detectAction", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="add-captions">Auto-Captions</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically add captions to clips
                    </p>
                  </div>
                  <Switch
                    id="add-captions"
                    checked={settings.addCaptions}
                    onCheckedChange={(checked) =>
                      handleSettingChange("addCaptions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="add-music">Background Music</Label>
                    <p className="text-sm text-muted-foreground">
                      Add trending music based on clip content
                    </p>
                  </div>
                  <Switch
                    id="add-music"
                    checked={settings.addMusic}
                    onCheckedChange={(checked) =>
                      handleSettingChange("addMusic", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="optimize-trends">Trend Optimization</Label>
                    <p className="text-sm text-muted-foreground">
                      Optimize clips based on current platform trends
                    </p>
                  </div>
                  <Switch
                    id="optimize-trends"
                    checked={settings.optimizeForTrends}
                    onCheckedChange={(checked) =>
                      handleSettingChange("optimizeForTrends", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleGenerateClips}
                disabled={!file || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Clips...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Clips
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-4 pt-4">
            {generatedClips.length > 0 ? (
              <>
                <div className="p-4 border rounded-md bg-green-50 text-green-700 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>
                    Successfully generated {generatedClips.length} clips
                    optimized for {settings.platforms.length} platforms!
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {generatedClips.map((clip) => (
                    <Card key={clip.id} className="overflow-hidden">
                      <div className="relative aspect-video bg-muted">
                        <img
                          src={clip.thumbnail}
                          alt={clip.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 right-2">
                          <Badge
                            className={getPlatformColor(clip.platform)}
                            variant="secondary"
                          >
                            <span className="flex items-center gap-1">
                              {getPlatformIcon(clip.platform)}
                              {clip.platform.charAt(0).toUpperCase() +
                                clip.platform.slice(1)}
                            </span>
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium truncate">{clip.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {clip.duration} seconds
                        </p>
                      </CardContent>
                      <CardFooter className="flex justify-between p-4 pt-0">
                        <Button variant="outline" size="sm">
                          Preview
                        </Button>
                        <Button size="sm">Edit</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  No clips generated yet. Upload a video and generate clips
                  first.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClipGenerator;
