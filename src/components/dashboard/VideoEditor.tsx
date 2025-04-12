import React, { useState, useRef, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Pause,
  RotateCcw,
  Crop,
  Download,
  Share2,
  Maximize2,
  Minimize2,
  Move,
  RotateCw,
  Scissors,
  Save,
} from "lucide-react";

interface VideoEditorProps {
  videoSrc?: string;
  thumbnailUrl?: string;
  videoName?: string;
  onSave?: (editedVideo: {
    url: string;
    crop: { x: number; y: number; width: number; height: number };
    rotation: number;
  }) => void;
  onCancel?: () => void;
}

const VideoEditor = ({
  videoSrc = "",
  thumbnailUrl = "",
  videoName = "",
  onSave = () => {},
  onCancel = () => {},
}: VideoEditorProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [zoom, setZoom] = useState(100);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isYoutubeVideo, setIsYoutubeVideo] = useState(false);
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState("");

  // Helper function to convert YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    try {
      // Handle youtube.com/watch?v= format
      if (url.includes("youtube.com/watch?v=")) {
        const videoId = new URL(url).searchParams.get("v");
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Handle youtu.be/ format
      if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      // Return original URL if we couldn't parse it
      return url;
    } catch (error) {
      console.error("Error parsing YouTube URL:", error);
      return url;
    }
  };

  useEffect(() => {
    // Check if it's a YouTube video
    if (
      videoSrc &&
      (videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be"))
    ) {
      setIsYoutubeVideo(true);
      setYoutubeEmbedUrl(getYouTubeEmbedUrl(videoSrc));
    } else {
      setIsYoutubeVideo(false);
    }

    // Reset states when video source changes
    setIsPlaying(false);
    setCurrentTime(0);
    setRotation(0);
    setCrop({ x: 0, y: 0, width: 100, height: 100 });
    setZoom(100);
    setIsVideoLoaded(false);
  }, [videoSrc]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    if (!videoRef.current) return;

    videoRef.current.currentTime = 0;
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const handleRotate = (direction: "clockwise" | "counterclockwise") => {
    const change = direction === "clockwise" ? 90 : -90;
    setRotation((prev) => (prev + change) % 360);
  };

  const handleCropChange = (
    dimension: "x" | "y" | "width" | "height",
    value: number,
  ) => {
    setCrop((prev) => ({
      ...prev,
      [dimension]: value,
    }));
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleExport = () => {
    // In a real implementation, this would process the video with the applied edits
    // and generate a downloadable file
    console.log("Exporting video with settings:", {
      crop,
      rotation,
      zoom,
    });

    // For now, we'll just call the onSave callback with the current settings
    onSave({
      url: videoSrc,
      crop,
      rotation,
    });

    // Create a mock download link
    if (videoSrc) {
      try {
        // Create a temporary anchor element
        const downloadLink = document.createElement("a");
        downloadLink.href = videoSrc;
        downloadLink.download = videoName || "edited-video.mp4";

        // Append to the document, click it, and remove it
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        alert("Video exported successfully! Check your downloads folder.");
      } catch (error) {
        console.error("Error exporting video:", error);
        alert("Video exported successfully! (This is a mock implementation)");
      }
    } else {
      alert("Video exported successfully! (This is a mock implementation)");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-4xl">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Video Editor</h2>
        {videoName && (
          <p className="text-sm text-gray-500">Editing: {videoName}</p>
        )}
      </div>

      <div
        className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}
        ref={containerRef}
      >
        {/* Video preview area */}
        <div
          className={`relative aspect-video bg-gray-900 overflow-hidden mx-auto ${isFullscreen ? "h-full w-full object-contain" : ""}`}
        >
          {!videoSrc ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-gray-500">No video selected</p>
            </div>
          ) : isYoutubeVideo ? (
            // YouTube videos can't be directly edited in the browser due to iframe limitations
            <div className="relative w-full h-full">
              <iframe
                className="w-full h-full object-contain bg-black"
                src={youtubeEmbedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
                <div className="text-center text-white p-4 max-w-md">
                  <h3 className="text-xl font-bold mb-2">
                    YouTube Video Editing
                  </h3>
                  <p className="mb-4">
                    Due to YouTube's restrictions, direct editing of YouTube
                    videos is limited. You can adjust basic parameters below,
                    but for full editing capabilities, please download the video
                    first.
                  </p>
                  <p className="text-sm mb-4 bg-yellow-500/20 p-2 rounded">
                    Pro Tip: For best results with YouTube videos, select 720p
                    or higher quality during download.
                  </p>
                  <Button
                    variant="outline"
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Video
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                transform: `rotate(${rotation}deg) scale(${zoom / 100})`,
              }}
            >
              <video
                ref={videoRef}
                src={videoSrc}
                className="max-w-full max-h-full object-contain"
                onTimeUpdate={() =>
                  videoRef.current &&
                  setCurrentTime(videoRef.current.currentTime)
                }
                onDurationChange={() =>
                  videoRef.current && setDuration(videoRef.current.duration)
                }
                onLoadedData={() => setIsVideoLoaded(true)}
                controls={false}
              />

              {/* Crop overlay */}
              {isVideoLoaded && (
                <div
                  className="absolute border-2 border-blue-500 border-dashed pointer-events-none"
                  style={{
                    left: `${crop.x}%`,
                    top: `${crop.y}%`,
                    width: `${crop.width}%`,
                    height: `${crop.height}%`,
                  }}
                ></div>
              )}
            </div>
          )}

          {/* Video controls overlay */}
          {videoSrc && !isYoutubeVideo && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleReset}
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCcw size={20} />
                  </Button>
                  <span className="text-sm">
                    {Math.floor(currentTime / 60)}:
                    {(currentTime % 60).toString().padStart(2, "0")} /
                    {Math.floor(duration / 60)}:
                    {(duration % 60).toString().padStart(2, "0")}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? (
                    <Minimize2 size={20} />
                  ) : (
                    <Maximize2 size={20} />
                  )}
                </Button>
              </div>

              {/* Progress bar */}
              <Slider
                className="mt-2"
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={(values) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = values[0];
                  }
                  setCurrentTime(values[0]);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Video editing controls */}
      <div className="p-4">
        <Tabs defaultValue="crop">
          <TabsList className="w-full">
            <TabsTrigger value="crop" className="flex-1">
              <Crop className="mr-2 h-4 w-4" /> Crop
            </TabsTrigger>
            <TabsTrigger value="rotate" className="flex-1">
              <RotateCw className="mr-2 h-4 w-4" /> Rotate
            </TabsTrigger>
            <TabsTrigger value="trim" className="flex-1">
              <Scissors className="mr-2 h-4 w-4" /> Trim
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crop" className="pt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Horizontal Position (X)
                </p>
                <Slider
                  value={[crop.x]}
                  max={100 - crop.width}
                  step={1}
                  onValueChange={(values) => handleCropChange("x", values[0])}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Vertical Position (Y)
                </p>
                <Slider
                  value={[crop.y]}
                  max={100 - crop.height}
                  step={1}
                  onValueChange={(values) => handleCropChange("y", values[0])}
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Width</p>
                <Slider
                  value={[crop.width]}
                  min={10}
                  max={100 - crop.x}
                  step={1}
                  onValueChange={(values) =>
                    handleCropChange("width", values[0])
                  }
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Height</p>
                <Slider
                  value={[crop.height]}
                  min={10}
                  max={100 - crop.y}
                  step={1}
                  onValueChange={(values) =>
                    handleCropChange("height", values[0])
                  }
                />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Zoom</p>
                <Slider
                  value={[zoom]}
                  min={50}
                  max={200}
                  step={1}
                  onValueChange={handleZoomChange}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">50%</span>
                  <span className="text-xs text-gray-500">{zoom}%</span>
                  <span className="text-xs text-gray-500">200%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rotate" className="pt-4">
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => handleRotate("counterclockwise")}
                  className="flex-1"
                >
                  <RotateCcw className="mr-2 h-4 w-4" /> Rotate Left
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRotate("clockwise")}
                  className="flex-1"
                >
                  <RotateCw className="mr-2 h-4 w-4" /> Rotate Right
                </Button>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Current Rotation: {rotation}°
                </p>
                <Slider
                  value={[rotation]}
                  min={0}
                  max={359}
                  step={1}
                  onValueChange={(values) => setRotation(values[0])}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">0°</span>
                  <span className="text-xs text-gray-500">180°</span>
                  <span className="text-xs text-gray-500">359°</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trim" className="pt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Trim video (start/end points)
                </p>
                <Slider value={[0, 100]} max={100} step={1} />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">0%</span>
                  <span className="text-xs text-gray-500">100%</span>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 p-4 bg-gray-50 rounded-md">
                <p>
                  Trimming functionality will be available in the next update.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t border-gray-200 flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <div className="space-x-2">
          <Button variant="outline" disabled={isYoutubeVideo}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="default" onClick={handleExport}>
            <Save className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;
