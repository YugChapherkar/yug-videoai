import { VideoData } from "@/lib/api";

// This file provides mock implementations for API calls when the backend is not available

// Mock video data for testing
const mockVideos: VideoData[] = [
  {
    id: "1",
    name: "Product Demo.mp4",
    platform: "YouTube",
    date: "2023-06-15",
    status: "completed",
    thumbnail:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=120&q=80",
    duration: "2:15",
    size: "24.5 MB",
  },
  {
    id: "2",
    name: "Tutorial Video.mp4",
    platform: "Instagram",
    date: "2023-06-14",
    status: "processing",
    thumbnail:
      "https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=120&q=80",
    duration: "1:30",
    size: "18.2 MB",
  },
  {
    id: "3",
    name: "Marketing Clip.mp4",
    platform: "TikTok",
    date: "2023-06-13",
    status: "failed",
    thumbnail:
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=120&q=80",
    duration: "0:45",
    size: "8.7 MB",
  },
];

// Mock upload function that simulates the API behavior
export const mockUploadVideo = (
  file: File,
  onProgress?: (progress: number) => void,
): Promise<VideoData> => {
  return new Promise((resolve, reject) => {
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (onProgress) onProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // Create a mock video data response
        const videoData: VideoData = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          platform: "Unknown",
          date: new Date().toISOString().split("T")[0],
          status: "completed",
          thumbnail:
            "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=120&q=80",
          duration: "1:30", // Mock duration
          size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        };

        // Add to mock videos
        mockVideos.unshift(videoData);

        // Simulate network delay
        setTimeout(() => resolve(videoData), 500);
      }
    }, 200);
  });
};

// Mock function to get user videos
export const mockGetUserVideos = (): Promise<VideoData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockVideos]), 500);
  });
};

// Mock function to delete a video
export const mockDeleteVideo = (id: string): Promise<void> => {
  return new Promise((resolve) => {
    const index = mockVideos.findIndex((video) => video.id === id);
    if (index !== -1) {
      mockVideos.splice(index, 1);
    }
    setTimeout(resolve, 300);
  });
};

// Mock function to process a video
export const mockProcessVideo = (
  videoId: string,
  settings: any,
  onProgress?: (progress: number) => void,
): Promise<VideoData> => {
  return new Promise((resolve) => {
    // Find the video
    const video = mockVideos.find((v) => v.id === videoId);
    if (!video) {
      throw new Error("Video not found");
    }

    // Update status to processing
    video.status = "processing";
    video.platform = settings.platform || "YouTube";

    // Simulate processing progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (onProgress) onProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        video.status = "completed";
        setTimeout(() => resolve({ ...video }), 500);
      }
    }, 300);
  });
};

// Mock function to upload a YouTube video
export const mockUploadYoutubeVideo = (
  youtubeUrl: string,
  onProgress?: (progress: number) => void,
): Promise<VideoData> => {
  return new Promise((resolve, reject) => {
    // Extract video ID from YouTube URL
    const getYoutubeVideoId = (url: string) => {
      const regExp =
        /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
      const match = url.match(regExp);
      return match && match[7].length === 11 ? match[7] : null;
    };

    const videoId = getYoutubeVideoId(youtubeUrl);
    if (!videoId) {
      reject(new Error("Invalid YouTube URL"));
      return;
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (onProgress) onProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);

        // Create a mock video data response
        const videoTitle = `YouTube Import - ${new Date().toLocaleTimeString()}`;
        const videoData: VideoData = {
          id: `yt-${videoId}`,
          name: videoTitle,
          platform: "YouTube",
          date: new Date().toISOString().split("T")[0],
          status: "completed",
          thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          duration: "3:45", // Mock duration
          size: "32.7 MB", // Mock size
          url: `https://www.youtube.com/watch?v=${videoId}`,
        };

        // Add to mock videos
        mockVideos.unshift(videoData);

        // Simulate network delay
        setTimeout(() => resolve(videoData), 500);
      }
    }, 200);
  });
};
