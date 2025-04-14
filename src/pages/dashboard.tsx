import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import Sidebar from "../components/dashboard/Sidebar";
import UploadSection from "../components/dashboard/UploadSection";
import VideoPreview from "../components/dashboard/VideoPreview";
import VideoEditor from "../components/dashboard/VideoEditor";
import SimplifiedControls from "../components/dashboard/SimplifiedControls";
import ShortFormGenerator from "../components/dashboard/ShortFormGenerator";
import PlatformTabs from "../components/dashboard/PlatformTabs";
import ProcessingControls from "../components/dashboard/ProcessingControls";
import VideoHistory from "../components/dashboard/VideoHistory";
import GeneratedShortsGrid from "../components/dashboard/GeneratedShortsGrid";
import { Button } from "../components/ui/button";
import { Edit, Eye, X } from "lucide-react";
import QuickStartGuide from "../components/dashboard/QuickStartGuide";

interface PlatformSettings {
  aspectRatio: string;
  resolution: string;
  quality: number;
  autoCaption: boolean;
  customSettings: Record<string, any>;
}

const Dashboard = () => {
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingShorts, setIsGeneratingShorts] = useState(false);
  const [generatedShorts, setGeneratedShorts] = useState<
    { url: string; platform: string; thumbnail: string }[]
  >([]);
  const [selectedPlatform, setSelectedPlatform] = useState("youtube");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("");
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState<string>("");
  const [currentVideoName, setCurrentVideoName] = useState<string>("");
  const [isEditorMode, setIsEditorMode] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    aspectRatio: "16:9",
    resolution: "1920x1080",
    quality: 80,
    autoCaption: false,
    customSettings: {
      endScreen: true,
      annotations: false,
    },
  });

  // Helper function to get platform name
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

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setIsVideoUploaded(true);
      console.log("Files uploaded and ready for processing:", files);
    }
  };

  // Handle video selection
  const handleVideoSelected = (
    videoUrl: string,
    thumbnailUrl: string,
    videoName: string,
  ) => {
    console.log("Video selected for preview:", {
      videoUrl,
      thumbnailUrl,
      videoName,
    });
    setCurrentVideoUrl(videoUrl);
    setCurrentThumbnailUrl(thumbnailUrl);
    setCurrentVideoName(videoName);
    setIsVideoUploaded(true);
  };

  // Handle video processing
  const handleProcessVideo = async () => {
    if (!isVideoUploaded) return;

    setIsProcessing(true);

    try {
      // In a real implementation, this would use the API to process the video
      // For now, we'll simulate processing with a timeout
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulate successful processing
      console.log("Video processed successfully with settings:", {
        platform: selectedPlatform,
        ...platformSettings,
      });
    } catch (error) {
      console.error("Error processing video:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle platform change
  const handlePlatformChange = (platform: string) => {
    setSelectedPlatform(platform);
  };

  // Handle settings change
  const handleSettingsChange = (settings: PlatformSettings) => {
    setPlatformSettings(settings);
  };

  // Toggle mobile sidebar
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>Dashboard | VideoAI Resizer</title>
      </Helmet>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - hidden on mobile unless toggled */}
        <Sidebar
          activePath="/dashboard"
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          {/* Header with mobile menu toggle */}
          <DashboardHeader onMobileMenuToggle={toggleMobileSidebar} />

          {/* Main dashboard area */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
              {/* Quick Start Guide */}
              {showGuide && (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => setShowGuide(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <QuickStartGuide onClose={() => setShowGuide(false)} />
                </div>
              )}
              {/* Upload section */}
              <UploadSection
                onFileUpload={handleFileUpload}
                isUploading={isProcessing}
                onVideoSelected={handleVideoSelected}
              />

              {/* Video preview and platform settings */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                {/* Video preview or editor - takes up 2/3 of the space on large screens */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                  <div className="flex justify-end mb-2">
                    {isVideoUploaded && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditorMode(!isEditorMode)}
                        className="flex items-center gap-2"
                      >
                        {isEditorMode ? (
                          <>
                            <Eye className="h-4 w-4" /> View Preview
                          </>
                        ) : (
                          <>
                            <Edit className="h-4 w-4" /> Edit Video
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {isEditorMode ? (
                    <VideoEditor
                      videoSrc={currentVideoUrl}
                      thumbnailUrl={currentThumbnailUrl}
                      videoName={currentVideoName}
                      onSave={() => {
                        setIsEditorMode(false);
                        // Additional save logic can be added here
                      }}
                      onCancel={() => setIsEditorMode(false)}
                    />
                  ) : (
                    <VideoPreview
                      videoSrc={currentVideoUrl}
                      aspectRatio={platformSettings.aspectRatio}
                      isProcessing={isProcessing}
                    />
                  )}
                </div>

                {/* Platform tabs - takes up 1/3 of the space on large screens */}
                <div className="order-1 lg:order-2">
                  <PlatformTabs
                    selectedPlatform={selectedPlatform}
                    settings={platformSettings}
                    onPlatformChange={handlePlatformChange}
                    onSettingsChange={handleSettingsChange}
                  />
                </div>
              </div>

              {/* Simplified Controls for quick actions */}
              {isVideoUploaded && !isEditorMode && (
                <SimplifiedControls
                  onCropClick={() => setIsEditorMode(true)}
                  onRotateClick={() => setIsEditorMode(true)}
                  onTrimClick={() => setIsEditorMode(true)}
                  onExportClick={handleProcessVideo}
                  onShareClick={() =>
                    alert("Sharing functionality will be available soon!")
                  }
                  isProcessing={isProcessing}
                />
              )}

              {/* Short Form Generator */}
              {isVideoUploaded && (
                <ShortFormGenerator
                  videoSrc={currentVideoUrl}
                  videoName={currentVideoName}
                  isProcessing={isGeneratingShorts}
                  onGenerateShorts={async (settings) => {
                    setIsGeneratingShorts(true);
                    console.log("Generating shorts with settings:", settings);

                    // Simulate processing time
                    await new Promise((resolve) => setTimeout(resolve, 5000));

                    // Mock generated shorts
                    const mockShorts = Array(settings.clipCount)
                      .fill(0)
                      .map((_, i) => ({
                        url: currentVideoUrl,
                        platform:
                          settings.platforms[i % settings.platforms.length],
                        thumbnail:
                          currentThumbnailUrl ||
                          `https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=120&q=80&random=${i}`,
                      }));

                    setGeneratedShorts(mockShorts);
                    setIsGeneratingShorts(false);

                    // Show success message
                    alert(
                      `Successfully generated ${settings.clipCount} short-form videos!`,
                    );
                  }}
                />
              )}

              {/* Processing controls */}
              <ProcessingControls
                onProcess={handleProcessVideo}
                isProcessing={isProcessing}
                isVideoUploaded={isVideoUploaded}
              />

              {/* Generated Shorts Grid */}
              {generatedShorts.length > 0 && (
                <GeneratedShortsGrid
                  shorts={generatedShorts}
                  onDownload={(short) => {
                    try {
                      // Create a blob from a mock video data instead of using the YouTube URL
                      const mockVideoBlob = new Blob(
                        [new ArrayBuffer(1024 * 1024)],
                        { type: "video/mp4" },
                      );
                      const blobUrl = URL.createObjectURL(mockVideoBlob);

                      // Create a temporary anchor element
                      const downloadLink = document.createElement("a");
                      downloadLink.href = blobUrl;
                      downloadLink.download = `short-${short.platform}.mp4`;
                      document.body.appendChild(downloadLink);
                      downloadLink.click();
                      document.body.removeChild(downloadLink);

                      // Clean up the blob URL
                      URL.revokeObjectURL(blobUrl);

                      alert(
                        `Downloaded ${getPlatformName(short.platform)} video successfully!`,
                      );
                    } catch (error) {
                      console.error("Download error:", error);
                      alert(
                        "Could not download the video. Please try again later.",
                      );
                    }
                  }}
                  onShare={(short) => {
                    alert(
                      `Sharing functionality for ${short.platform} will be available soon!`,
                    );
                  }}
                />
              )}

              {/* Video history */}
              <VideoHistory />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
