import React, { useState, useCallback, useEffect } from "react";
import {
  Upload,
  FileType,
  Info,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Youtube,
  Link as LinkIcon,
  ArrowRight,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { uploadVideo, uploadYoutubeVideo, VideoData } from "@/lib/api";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoQualitySelector from "./VideoQualitySelector";
import DownloadProgressIndicator from "./DownloadProgressIndicator";

interface UploadSectionProps {
  onFileUpload?: (videoData: VideoData) => void;
  supportedFormats?: string[];
  maxFileSize?: number; // in MB
  isUploading?: boolean;
  uploadProgress?: number;
  setIsUploading?: (isUploading: boolean) => void;
  setUploadProgress?: (progress: number) => void;
  onVideoSelected?: (
    videoUrl: string,
    thumbnailUrl: string,
    videoName: string,
  ) => void;
}

const UploadSection = ({
  onFileUpload = () => {},
  supportedFormats = [".mp4", ".mov", ".avi", ".mkv", ".webm"],
  maxFileSize = 500, // 500MB default
  isUploading: externalIsUploading,
  uploadProgress: externalUploadProgress,
  setIsUploading: externalSetIsUploading,
  setUploadProgress: externalSetUploadProgress,
  onVideoSelected = () => {},
}: UploadSectionProps) => {
  // Use internal state if external state is not provided
  const [internalIsUploading, setInternalIsUploading] = useState(false);
  const [internalUploadProgress, setInternalUploadProgress] = useState(0);

  // Determine which state to use
  const isUploading =
    externalIsUploading !== undefined
      ? externalIsUploading
      : internalIsUploading;
  const uploadProgress =
    externalUploadProgress !== undefined
      ? externalUploadProgress
      : internalUploadProgress;
  const setIsUploading = externalSetIsUploading || setInternalIsUploading;
  const setUploadProgress =
    externalSetUploadProgress || setInternalUploadProgress;

  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<VideoData | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [isYoutubeUrlValid, setIsYoutubeUrlValid] = useState(true);
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [downloadStatus, setDownloadStatus] = useState("");

  // Reset success state when upload starts
  useEffect(() => {
    if (isUploading) {
      setUploadSuccess(false);
    }
  }, [isUploading]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFiles = (fileList: FileList | File[]): File[] => {
    const validFiles: File[] = [];
    const fileArray = Array.from(fileList);

    // Reset error
    setError(null);

    for (const file of fileArray) {
      const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;

      // Check file type
      if (!supportedFormats.includes(extension)) {
        setError(
          `Unsupported file format: ${extension}. Please use: ${supportedFormats.join(", ")}`,
        );
        continue;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        setError(
          `File too large: ${file.name}. Maximum size is ${maxFileSize}MB`,
        );
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const handleUpload = async (validFiles: File[]) => {
    if (validFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setUploadSuccess(false);

    try {
      // Upload the first file (in a real app, you might want to handle multiple files)
      const result = await uploadVideo(validFiles[0], (progress) => {
        setUploadProgress(progress);
      });

      if (result.error) {
        setError(result.error);
        setIsUploading(false);
      } else if (result.data) {
        // Set success state
        setUploadSuccess(true);
        setUploadedVideo(result.data);
        // Call the parent component's callback
        onFileUpload(result.data);
        // Notify parent about the video URL
        if (result.data.url) {
          onVideoSelected(
            result.data.url,
            result.data.thumbnail || "",
            result.data.name,
          );
        }
        // Keep progress at 100% for a moment before resetting
        setTimeout(() => {
          setIsUploading(false);
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setIsUploading(false);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const validFiles = validateFiles(e.dataTransfer.files);
        if (validFiles.length > 0) {
          setFiles(validFiles);
          handleUpload(validFiles);
        }
      }
    },
    [onFileUpload, supportedFormats, maxFileSize],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const validFiles = validateFiles(e.target.files);
        if (validFiles.length > 0) {
          setFiles(validFiles);
          handleUpload(validFiles);
        }
      }
    },
    [onFileUpload, supportedFormats, maxFileSize],
  );

  const resetUpload = () => {
    setFiles([]);
    setUploadSuccess(false);
    setUploadedVideo(null);
    setError(null);
  };

  const validateYoutubeUrl = (url: string) => {
    // Basic YouTube URL validation
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11}).*$/;
    return youtubeRegex.test(url);
  };

  const handleYoutubeUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setYoutubeUrl(url);
    setIsYoutubeUrlValid(url === "" || validateYoutubeUrl(url));
  };

  const handleYoutubeUpload = async () => {
    if (!youtubeUrl || !validateYoutubeUrl(youtubeUrl)) {
      setIsYoutubeUrlValid(false);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setUploadSuccess(false);

    try {
      // Initialize download status
      setDownloadStatus("Initializing download...");

      const result = await uploadYoutubeVideo(
        youtubeUrl,
        (progress) => {
          setUploadProgress(progress);

          // Update status message based on progress
          if (progress < 10) {
            setDownloadStatus("Preparing to download...");
          } else if (progress < 30) {
            setDownloadStatus(
              `Downloading video from YouTube (${selectedQuality})...`,
            );
          } else if (progress < 60) {
            setDownloadStatus("Processing video...");
          } else if (progress < 90) {
            setDownloadStatus("Finalizing...");
          } else {
            setDownloadStatus("Download complete!");
          }
        },
        selectedQuality, // Use selected quality
      );

      if (result.error) {
        setError(result.error);
        setIsUploading(false);
      } else if (result.data) {
        // Set success state
        setUploadSuccess(true);
        setUploadedVideo(result.data);
        // Call the parent component's callback
        onFileUpload(result.data);
        // Notify parent about the video URL
        if (result.data.url) {
          onVideoSelected(
            result.data.url,
            result.data.thumbnail || "",
            result.data.name,
          );
        }
        // Keep progress at 100% for a moment before resetting
        setTimeout(() => {
          setIsUploading(false);
        }, 1000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Upload Your Video</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            document
              .getElementById("help-guide")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Need Help?
        </Button>
      </div>

      <Tabs defaultValue="upload" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center">
            <Upload className="mr-2 h-4 w-4" /> Upload File
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center">
            <Youtube className="mr-2 h-4 w-4" /> YouTube Link
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          {/* Drag and drop area */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors",
              isDragging
                ? "border-primary bg-primary/5"
                : uploadSuccess
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-primary/50 hover:bg-gray-50",
              isUploading ? "pointer-events-none opacity-70" : "",
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => {
              if (!isUploading && !uploadSuccess) {
                document.getElementById("file-upload")?.click();
              }
            }}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept={supportedFormats.join(",")}
              onChange={handleFileInputChange}
              disabled={isUploading || uploadSuccess}
            />

            {uploadSuccess && uploadedVideo ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <p className="text-lg font-medium mb-2 text-green-700">
                  Upload Successful!
                </p>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Your video "{uploadedVideo.name}" has been uploaded and is
                  ready for processing.
                </p>
                <Button variant="outline" onClick={resetUpload}>
                  Upload Another Video
                </Button>
              </>
            ) : isUploading ? (
              <div className="text-center">
                <RefreshCw className="h-12 w-12 text-primary mb-4 animate-spin" />
                <p className="text-lg font-medium mb-2">Uploading...</p>
                <div className="w-full max-w-md mb-2">
                  <Progress value={uploadProgress} className="h-2" />
                </div>
                <p className="text-sm text-gray-500">
                  {uploadProgress}% complete
                </p>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium mb-2">
                  Drag & drop your video here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse files
                </p>
                <Button variant="outline" className="mb-2">
                  <FileType className="mr-2 h-4 w-4" /> Select Video Files
                </Button>
              </>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* File information */}
          {files.length > 0 && !isUploading && !uploadSuccess && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Selected Files:</h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="text-sm flex items-center p-2 bg-gray-50 rounded-md"
                  >
                    <FileType className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="font-medium mr-2">{file.name}</span>
                    <span className="text-gray-500 text-xs">
                      ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Supported formats info */}
          <div className="mt-4 flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-gray-400 mr-2 cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>These are the video formats our system can process.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-xs text-gray-500">
              Supported formats: {supportedFormats.join(", ")} | Max file size:{" "}
              {maxFileSize}MB
            </p>
          </div>
        </TabsContent>

        <TabsContent value="youtube">
          {uploadSuccess && uploadedVideo ? (
            <div className="border-2 border-green-500 bg-green-50 rounded-lg p-8 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <p className="text-lg font-medium mb-2 text-green-700">
                YouTube Video Imported Successfully!
              </p>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Your video "{uploadedVideo.name}" has been imported and is ready
                for processing.
              </p>
              <Button variant="outline" onClick={resetUpload}>
                Import Another Video
              </Button>
            </div>
          ) : isUploading ? (
            <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
              </div>
              <p className="text-lg font-medium mb-4">{downloadStatus}</p>
              <div className="w-full max-w-md mb-2">
                <DownloadProgressIndicator
                  progress={uploadProgress}
                  status={downloadStatus}
                  isComplete={uploadProgress >= 100}
                />
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center">
              <Youtube className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-lg font-medium mb-2">Import from YouTube</p>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Paste a YouTube video link to import and convert it into
                multiple short-form videos
              </p>

              <div className="w-full max-w-md mb-4">
                <div className="flex">
                  <div
                    className={`flex-1 relative ${!isYoutubeUrlValid ? "border-red-500" : ""}`}
                  >
                    <input
                      type="text"
                      value={youtubeUrl}
                      onChange={handleYoutubeUrlChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className={`w-full p-2 pr-10 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary ${!isYoutubeUrlValid ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                    />
                    <LinkIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <Button
                    onClick={handleYoutubeUpload}
                    disabled={!youtubeUrl || !isYoutubeUrlValid}
                    className="rounded-l-none"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                {!isYoutubeUrlValid && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter a valid YouTube URL
                  </p>
                )}
              </div>

              <div className="w-full max-w-md mb-4">
                <VideoQualitySelector
                  selectedQuality={selectedQuality}
                  onQualityChange={setSelectedQuality}
                  disabled={isUploading}
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Info className="h-3 w-3" />
                <span>
                  Supported: YouTube videos up to 30 minutes in length
                </span>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 text-destructive mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UploadSection;
