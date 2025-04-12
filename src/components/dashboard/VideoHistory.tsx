import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "../ui/table";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Download,
  MoreVertical,
  Play,
  Share2,
  Trash2,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Filter,
} from "lucide-react";
import { getUserVideos, deleteVideo, VideoData } from "@/lib/api";
import { Skeleton } from "../ui/skeleton";

interface VideoHistoryProps {
  videos?: VideoData[];
  onPlay?: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  refreshTrigger?: number;
}

const VideoHistory = ({
  videos: initialVideos,
  onPlay = () => {},
  onDownload = () => {},
  onShare = () => {},
  onDelete = () => {},
  onEdit = () => {},
  refreshTrigger = 0,
}: VideoHistoryProps) => {
  const [videos, setVideos] = useState<VideoData[]>(initialVideos || []);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      if (initialVideos) {
        setVideos(initialVideos);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await getUserVideos();
        if (result.error) {
          setError(result.error);
        } else if (result.data) {
          setVideos(result.data);
          // In a real implementation with pagination:
          // setTotalPages(result.data.totalPages);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch videos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [initialVideos, refreshTrigger]);

  const toggleSelectVideo = (id: string) => {
    setSelectedVideos((prev) =>
      prev.includes(id)
        ? prev.filter((videoId) => videoId !== id)
        : [...prev, id],
    );
  };

  const handleDeleteVideo = async (id: string) => {
    setIsDeleting(true);
    try {
      const result = await deleteVideo(id);
      if (result.error) {
        setError(result.error);
      } else {
        // Remove the video from the list
        setVideos((prev) => prev.filter((video) => video.id !== id));
        // Remove from selected videos if it was selected
        setSelectedVideos((prev) => prev.filter((videoId) => videoId !== id));
        // Call the parent component's callback
        onDelete(id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete video");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    try {
      for (const id of selectedVideos) {
        const result = await deleteVideo(id);
        if (result.error) {
          setError(result.error);
          break;
        } else {
          // Remove the video from the list
          setVideos((prev) => prev.filter((video) => video.id !== id));
        }
      }
      setSelectedVideos([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete videos");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getUserVideos();
      if (result.error) {
        setError(result.error);
      } else if (result.data) {
        setVideos(result.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh videos");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-amber-500 animate-pulse" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
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
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Video History</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          {selectedVideos.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600">
          <p className="flex items-center">
            <AlertCircle className="h-4 w-4 mr-2" />
            {error}
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedVideos(videos.map((v) => v.id));
                    } else {
                      setSelectedVideos([]);
                    }
                  }}
                  checked={
                    selectedVideos.length === videos.length && videos.length > 0
                  }
                  disabled={isLoading || videos.length === 0}
                />
              </TableHead>
              <TableHead className="w-[250px]">Video</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeletons
              Array(3)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`loading-${index}`}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-20 rounded" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
            ) : videos.length > 0 ? (
              videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedVideos.includes(video.id)}
                      onChange={() => toggleSelectVideo(video.id)}
                      disabled={isDeleting}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-20 rounded overflow-hidden bg-gray-100">
                        <img
                          src={video.thumbnail}
                          alt={video.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            // Fallback image if thumbnail fails to load
                            (e.target as HTMLImageElement).src =
                              "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&q=80";
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                          onClick={() => onPlay(video.id)}
                          disabled={video.status !== "completed"}
                        >
                          <Play className="h-5 w-5 text-white" />
                        </Button>
                      </div>
                      <span className="font-medium truncate max-w-[150px]">
                        {video.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(video.platform)}`}
                    >
                      {video.platform}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(video.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(video.status)}
                      <span className="capitalize">{video.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>{video.duration}</TableCell>
                  <TableCell>{video.size}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDownload(video.id)}
                        disabled={video.status !== "completed" || isDeleting}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onShare(video.id)}
                        disabled={video.status !== "completed" || isDeleting}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isDeleting}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onEdit(video.id)}
                            disabled={isDeleting}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteVideo(video.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No videos in history yet. Upload a video to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {videos.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
          <div>Showing {videos.length} videos</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || isLoading}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages || isLoading}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoHistory;
