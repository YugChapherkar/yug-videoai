import React, { useState, useRef, useEffect } from "react";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Play,
  Pause,
  RotateCcw,
  Crop,
  Download,
  Share2,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface VideoPreviewProps {
  videoSrc?: string;
  aspectRatio?: string;
  isProcessing?: boolean;
  onCropChange?: (value: number[]) => void;
  onFormatChange?: (format: string) => void;
  onResolutionChange?: (resolution: string) => void;
}

const VideoPreview = ({
  videoSrc = "", // Will be empty if no video is uploaded
  aspectRatio = "16:9",
  isProcessing = false,
  onCropChange = () => {},
  onFormatChange = () => {},
  onResolutionChange = () => {},
}: VideoPreviewProps) => {
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100); // Default duration in seconds
  const [cropValues, setCropValues] = useState([0, 100]); // Default crop values (start and end percentages)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(!videoSrc);

  // Mock video formats and resolutions
  const videoFormats = ["MP4", "MOV", "AVI", "WebM"];
  const videoResolutions = ["1080p", "720p", "480p", "360p"];

  useEffect(() => {
    setShowPlaceholder(!videoSrc);
    setIsVideoLoaded(false);
    setIsVideoError(false);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }

    // If we have a YouTube URL, extract the video ID and create an embed URL
    if (videoSrc && videoSrc.includes("youtube.com/watch?v=")) {
      const videoId = new URL(videoSrc).searchParams.get("v");
      if (videoId) {
        // We'll handle YouTube videos differently in the render method
        setIsVideoLoaded(true);
      }
    } else if (videoSrc && videoSrc.includes("youtu.be/")) {
      const videoId = videoSrc.split("youtu.be/")[1]?.split("?")[0];
      if (videoId) {
        // We'll handle YouTube videos differently in the render method
        setIsVideoLoaded(true);
      }
    }
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

  const handleCropChange = (values: number[]) => {
    setCropValues(values);
    onCropChange(values);
  };

  const handleFormatChange = (format: string) => {
    onFormatChange(format);
  };

  const handleResolutionChange = (resolution: string) => {
    onResolutionChange(resolution);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // In a real implementation, this would toggle fullscreen mode
  };

  // Calculate aspect ratio class based on the provided ratio
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "1:1":
        return "aspect-square";
      case "4:3":
        return "aspect-[4/3]";
      case "9:16":
        return "aspect-[9/16]";
      case "16:9":
      default:
        return "aspect-video";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden w-full max-w-3xl">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Video Preview</h2>
        <p className="text-sm text-gray-500">
          Current aspect ratio: {aspectRatio}
        </p>
      </div>

      <div
        className={`relative ${isFullscreen ? "fixed inset-0 z-50 bg-black" : ""}`}
      >
        {/* Video preview area */}
        <div
          className={`relative ${getAspectRatioClass()} bg-gray-900 overflow-hidden mx-auto ${isFullscreen ? "h-full w-full object-contain" : ""}`}
        >
          {isProcessing ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
                <p>Processing video...</p>
              </div>
            </div>
          ) : (
            <>
              {showPlaceholder ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <p className="text-gray-500">
                    Upload a video to preview it here
                  </p>
                </div>
              ) : isVideoError ? (
                <div className="w-full h-full flex items-center justify-center bg-red-50">
                  <p className="text-red-500">
                    Error loading video. Please try again.
                  </p>
                </div>
              ) : (
                <>
                  {videoSrc && videoSrc.includes("youtube") ? (
                    // YouTube embed iframe for YouTube videos
                    <iframe
                      className="w-full h-full object-contain bg-black"
                      src={getYouTubeEmbedUrl(videoSrc)}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    // Regular video player for direct video files
                    <video
                      ref={videoRef}
                      src={videoSrc}
                      className="w-full h-full object-contain bg-black"
                      onTimeUpdate={() =>
                        videoRef.current &&
                        setCurrentTime(videoRef.current.currentTime)
                      }
                      onDurationChange={() =>
                        videoRef.current &&
                        setDuration(videoRef.current.duration)
                      }
                      onLoadedData={() => setIsVideoLoaded(true)}
                      onError={() => setIsVideoError(true)}
                      controls={false}
                    />
                  )}
                </>
              )}

              {/* Crop overlay (simplified representation) */}
              {isVideoLoaded && !showPlaceholder && (
                <div className="absolute inset-0 border-2 border-blue-500 border-dashed pointer-events-none"></div>
              )}

              {/* Video controls overlay */}
              {/* Only show video controls for direct video files, not for YouTube embeds */}
              {videoSrc && !videoSrc.includes("youtube") && (
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
            </>
          )}
        </div>
      </div>

      {/* Video editing controls */}
      <div className="p-4">
        <Tabs defaultValue="crop">
          <TabsList className="w-full">
            <TabsTrigger value="crop" className="flex-1">
              Crop
            </TabsTrigger>
            <TabsTrigger value="format" className="flex-1">
              Format
            </TabsTrigger>
            <TabsTrigger value="resolution" className="flex-1">
              Resolution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crop" className="pt-4">
            <div className="space-y-4">
              <div className="flex items-center">
                <Crop size={20} className="mr-2 text-gray-500" />
                <span className="text-sm font-medium">Adjust crop area</span>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Trim video (start/end points)
                </p>
                <Slider
                  value={cropValues}
                  max={100}
                  step={1}
                  onValueChange={handleCropChange}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {cropValues[0]}%
                  </span>
                  <span className="text-xs text-gray-500">
                    {cropValues[1]}%
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="format" className="pt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Select output format
                </p>
                <Select
                  onValueChange={handleFormatChange}
                  defaultValue={videoFormats[0]}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoFormats.map((format) => (
                      <SelectItem key={format} value={format}>
                        {format}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resolution" className="pt-4">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  Select output resolution
                </p>
                <Select
                  onValueChange={handleResolutionChange}
                  defaultValue={videoResolutions[0]}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select resolution" />
                  </SelectTrigger>
                  <SelectContent>
                    {videoResolutions.map((resolution) => (
                      <SelectItem key={resolution} value={resolution}>
                        {resolution}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Action buttons */}
      <div className="p-4 border-t border-gray-200 flex justify-between">
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled={isProcessing}>
            <Crop size={16} className="mr-2" />
            Apply Crop
          </Button>
        </div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" disabled={isProcessing}>
            <Share2 size={16} className="mr-2" />
            Share
          </Button>
          <Button variant="default" size="sm" disabled={isProcessing}>
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
