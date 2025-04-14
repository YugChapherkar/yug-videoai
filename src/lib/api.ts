// API client for communicating with Flask backend
// This file contains all the API functions for the application

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface VideoData {
  id: string;
  name: string;
  platform: string;
  date: string;
  status: "completed" | "processing" | "failed";
  thumbnail: string;
  duration: string;
  size: string;
  url?: string;
  detectedSubjects?: Array<{
    id: string;
    type: "face" | "person" | "object" | "text";
    confidence: number;
    boundingBox: { x: number; y: number; width: number; height: number };
    trackingPath?: Array<{
      time: number;
      x: number;
      y: number;
      width: number;
      height: number;
    }>;
  }>;
  engagementMetrics?: {
    engagingSegments: Array<{
      startTime: number;
      endTime: number;
      score: number;
    }>;
    overallScore: number;
  };
}

export interface ProcessingSettings {
  platform: string;
  aspectRatio: string;
  resolution: string;
  smartCrop?: boolean;
  faceTracking?: boolean;
  subjectDetection?: boolean;
  [key: string]: any;
}

export interface ClipData {
  id: string;
  title: string;
  platform: string;
  duration: number;
  thumbnail: string;
  status: "completed" | "processing" | "failed";
  url: string;
}

export interface CaptionData {
  id?: string;
  videoId: string;
  text: string;
  font: string;
  fontSize: number;
  color: string;
  backgroundColor: string;
  position: string;
  alignment: string;
  startTime: number;
  endTime: number;
  outline: boolean;
  outlineColor: string;
  shadow: boolean;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    return {
      error: isJson && data.message ? data.message : "An error occurred",
    };
  }

  return { data: data as T };
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Authentication APIs
export async function login(
  email: string,
  password: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await handleResponse(response);

    if (result.data && result.data.token) {
      localStorage.setItem("authToken", result.data.token);
      localStorage.setItem("user", JSON.stringify(result.data.user));
    }

    return result;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Login failed" };
  }
}

export async function signup(
  name: string,
  email: string,
  password: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    return handleResponse(response);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Signup failed" };
  }
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    // Clear local storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// Video Management APIs
export async function uploadVideo(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<ApiResponse<VideoData>> {
  const formData = new FormData();
  formData.append("video", file);

  try {
    try {
      // Create XMLHttpRequest to track upload progress
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const data = JSON.parse(xhr.responseText);
            resolve({ data });
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              resolve({ error: errorData.message || "Upload failed" });
            } catch (e) {
              resolve({ error: "Upload failed" });
            }
          }
        });

        xhr.addEventListener("error", () => {
          // If there's a network error, try the mock implementation
          console.log("Network error, using mock implementation");
          import("@/components/dashboard/MockApiHandler").then(
            ({ mockUploadVideo }) => {
              mockUploadVideo(file, onProgress)
                .then((data) => resolve({ data }))
                .catch((err) => resolve({ error: err.message }));
            },
          );
        });

        xhr.open("POST", `${API_BASE_URL}/api/videos/upload`);

        const token = localStorage.getItem("authToken");
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        xhr.send(formData);
      });
    } catch (fetchError) {
      console.log("Backend API not available, using mock implementation");
      // If the fetch fails (e.g., backend not available), use the mock implementation
      const { mockUploadVideo } = await import(
        "@/components/dashboard/MockApiHandler"
      );
      try {
        const mockData = await mockUploadVideo(file, onProgress);
        return { data: mockData };
      } catch (mockError) {
        throw mockError;
      }
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload failed" };
  }
}

export async function getUserVideos(): Promise<ApiResponse<VideoData[]>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/videos`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to fetch videos",
    };
  }
}

export async function getVideoById(
  videoId: string,
): Promise<ApiResponse<VideoData>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to fetch video",
    };
  }
}

export async function deleteVideo(videoId: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/videos/${videoId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to delete video",
    };
  }
}

export async function detectSubjectsInVideo(
  videoId: string,
  options?: {
    detectFaces?: boolean;
    trackSubjects?: boolean;
    minConfidence?: number;
  },
): Promise<ApiResponse<VideoData>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/videos/${videoId}/detect-subjects`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(
          options || {
            detectFaces: true,
            trackSubjects: true,
            minConfidence: 0.7,
          },
        ),
      },
    );

    return handleResponse(response);
  } catch (error) {
    // If the backend API is not available, use mock implementation
    console.log(
      "Backend API not available, using mock implementation for subject detection",
    );

    // Mock detected subjects with different types and confidence levels
    const mockDetectedSubjects = [
      {
        id: "subject-1",
        type: "face",
        confidence: 0.95,
        boundingBox: { x: 20, y: 15, width: 30, height: 40 },
        trackingPath: Array.from({ length: 10 }, (_, i) => ({
          time: i * 2,
          x: 20 + Math.sin(i * 0.5) * 5,
          y: 15 + Math.cos(i * 0.5) * 3,
          width: 30,
          height: 40,
        })),
      },
      {
        id: "subject-2",
        type: "person",
        confidence: 0.88,
        boundingBox: { x: 60, y: 25, width: 25, height: 60 },
        trackingPath: Array.from({ length: 10 }, (_, i) => ({
          time: i * 2,
          x: 60 + i * 0.5,
          y: 25,
          width: 25,
          height: 60,
        })),
      },
      {
        id: "subject-3",
        type: "object",
        confidence: 0.75,
        boundingBox: { x: 40, y: 60, width: 20, height: 15 },
      },
    ];

    return {
      data: {
        id: videoId,
        detectedSubjects: mockDetectedSubjects,
      } as VideoData,
    };
  }
}

export async function analyzeVideoEngagement(
  videoId: string,
  options?: {
    segmentLength?: number; // in seconds
    analysisDepth?: "basic" | "advanced";
  },
): Promise<ApiResponse<VideoData>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/videos/${videoId}/analyze-engagement`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(
          options || { segmentLength: 5, analysisDepth: "advanced" },
        ),
      },
    );

    return handleResponse(response);
  } catch (error) {
    // If the backend API is not available, use mock implementation
    console.log(
      "Backend API not available, using mock implementation for engagement analysis",
    );

    // Mock engagement metrics with engaging segments
    const mockEngagementMetrics = {
      engagingSegments: [
        { startTime: 5, endTime: 15, score: 0.92 },
        { startTime: 32, endTime: 48, score: 0.85 },
        { startTime: 67, endTime: 78, score: 0.78 },
      ],
      overallScore: 0.76,
    };

    return {
      data: {
        id: videoId,
        engagementMetrics: mockEngagementMetrics,
      } as VideoData,
    };
  }
}

export async function processVideo(
  videoId: string,
  settings: ProcessingSettings,
  onProgress?: (progress: number) => void,
): Promise<ApiResponse<VideoData>> {
  try {
    // Initial API call to start processing
    const response = await fetch(
      `${API_BASE_URL}/api/videos/${videoId}/process`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      },
    );

    const result = await handleResponse<{ jobId: string }>(response);

    if (result.error || !result.data) {
      return result as ApiResponse<VideoData>;
    }

    const jobId = result.data.jobId;

    // Poll for progress if callback provided
    if (onProgress) {
      const pollInterval = setInterval(async () => {
        try {
          const progressResponse = await fetch(
            `${API_BASE_URL}/api/jobs/${jobId}/progress`,
            { headers: getAuthHeaders() },
          );

          const progressResult = await handleResponse<{
            progress: number;
            completed: boolean;
          }>(progressResponse);

          if (progressResult.data) {
            onProgress(progressResult.data.progress);

            if (progressResult.data.completed) {
              clearInterval(pollInterval);
              // Get the processed video data
              const videoResponse = await fetch(
                `${API_BASE_URL}/api/videos/${videoId}`,
                { headers: getAuthHeaders() },
              );
              return handleResponse<VideoData>(videoResponse);
            }
          }
        } catch (error) {
          console.error("Error polling for progress:", error);
        }
      }, 1000);

      // Return initial response while polling happens in background
      return { data: { id: videoId, status: "processing" } as VideoData };
    }

    // If no progress callback, just return the initial response
    return { data: { id: videoId, status: "processing" } as VideoData };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Processing failed",
    };
  }
}

// Clip Generation APIs
export async function generateClips(
  videoId: string,
  settings: {
    platforms: string[];
    clipCount: number;
    minDuration: number;
    maxDuration: number;
    [key: string]: any;
  },
  onProgress?: (progress: number) => void,
): Promise<ApiResponse<ClipData[]>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/videos/${videoId}/clips/generate`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(settings),
      },
    );

    const result = await handleResponse<{ jobId: string }>(response);

    if (result.error || !result.data) {
      return result as ApiResponse<ClipData[]>;
    }

    const jobId = result.data.jobId;

    // Poll for progress if callback provided
    if (onProgress) {
      const pollInterval = setInterval(async () => {
        try {
          const progressResponse = await fetch(
            `${API_BASE_URL}/api/jobs/${jobId}/progress`,
            { headers: getAuthHeaders() },
          );

          const progressResult = await handleResponse<{
            progress: number;
            completed: boolean;
          }>(progressResponse);

          if (progressResult.data) {
            onProgress(progressResult.data.progress);

            if (progressResult.data.completed) {
              clearInterval(pollInterval);
              // Get the generated clips
              const clipsResponse = await fetch(
                `${API_BASE_URL}/api/videos/${videoId}/clips`,
                { headers: getAuthHeaders() },
              );
              return handleResponse<ClipData[]>(clipsResponse);
            }
          }
        } catch (error) {
          console.error("Error polling for progress:", error);
        }
      }, 1000);

      // Return empty array while polling happens in background
      return { data: [] };
    }

    // If no progress callback, just return empty array
    return { data: [] };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Clip generation failed",
    };
  }
}

// Caption APIs
export async function saveCaption(
  caption: CaptionData,
): Promise<ApiResponse<CaptionData>> {
  try {
    const method = caption.id ? "PUT" : "POST";
    const url = caption.id
      ? `${API_BASE_URL}/api/captions/${caption.id}`
      : `${API_BASE_URL}/api/captions`;

    const response = await fetch(url, {
      method,
      headers: getAuthHeaders(),
      body: JSON.stringify(caption),
    });

    return handleResponse(response);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to save caption",
    };
  }
}

export async function getCaptions(
  videoId: string,
): Promise<ApiResponse<CaptionData[]>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/videos/${videoId}/captions`,
      {
        headers: getAuthHeaders(),
      },
    );

    return handleResponse(response);
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to fetch captions",
    };
  }
}

// Analytics APIs
export async function getVideoAnalytics(
  timeRange: string,
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/analytics/videos?timeRange=${timeRange}`,
      {
        headers: getAuthHeaders(),
      },
    );

    return handleResponse(response);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch video analytics",
    };
  }
}

export async function getFeatureAnalytics(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/features`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch feature analytics",
    };
  }
}

export async function getPlatformAnalytics(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analytics/platforms`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch platform analytics",
    };
  }
}

// Export an api object with all the functions for easier imports
// Function to upload a YouTube video URL
export async function uploadYoutubeVideo(
  youtubeUrl: string,
  onProgress?: (progress: number) => void,
  quality: string = "720p", // Default quality is 720p
): Promise<ApiResponse<VideoData>> {
  console.log(`Downloading YouTube video with quality: ${quality}`);
  try {
    // First, notify that we're starting
    if (onProgress) onProgress(5);

    try {
      // Try to make the API request to process the YouTube URL
      // Now including quality parameter for server-side download
      const response = await fetch(
        `${API_BASE_URL}/api/videos/youtube/download`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ url: youtubeUrl, quality }),
        },
      );

      // Get the job ID from the response to track progress
      const initialResult = await handleResponse<{ jobId: string }>(response);

      if (initialResult.error || !initialResult.data) {
        return initialResult as ApiResponse<VideoData>;
      }

      const jobId = initialResult.data.jobId;

      // Poll for progress if callback provided
      if (onProgress) {
        // Start with 10% progress to indicate the download has started
        onProgress(10);

        const pollInterval = setInterval(async () => {
          try {
            const progressResponse = await fetch(
              `${API_BASE_URL}/api/jobs/${jobId}/progress`,
              { headers: getAuthHeaders() },
            );

            const progressResult = await handleResponse<{
              progress: number;
              completed: boolean;
              videoData?: VideoData;
            }>(progressResponse);

            if (progressResult.data) {
              // Update progress (scale from 0-100)
              onProgress(progressResult.data.progress);

              if (progressResult.data.completed) {
                clearInterval(pollInterval);

                // If the server included the video data in the response, use it
                if (progressResult.data.videoData) {
                  return { data: progressResult.data.videoData };
                }

                // Otherwise, make a separate request to get the video data
                const videoResponse = await fetch(
                  `${API_BASE_URL}/api/jobs/${jobId}/result`,
                  { headers: getAuthHeaders() },
                );
                return handleResponse<VideoData>(videoResponse);
              }
            }
          } catch (error) {
            console.error("Error polling for progress:", error);
          }
        }, 1000);

        // Return initial response while polling happens in background
        return { data: { id: jobId, status: "processing" } as VideoData };
      } else {
        // If no progress callback, just wait for the download to complete
        const videoResponse = await fetch(
          `${API_BASE_URL}/api/jobs/${jobId}/result`,
          { headers: getAuthHeaders() },
        );
        return handleResponse<VideoData>(videoResponse);
      }
    } catch (fetchError) {
      console.log("Backend API not available, using mock implementation");
      // If the fetch fails (e.g., backend not available), use the mock implementation
      const { mockUploadYoutubeVideo } = await import(
        "@/components/dashboard/MockApiHandler"
      );
      try {
        const mockData = await mockUploadYoutubeVideo(youtubeUrl, onProgress);
        return { data: mockData };
      } catch (mockError) {
        throw mockError;
      }
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to download YouTube video",
    };
  }
}

export const api = {
  login,
  signup,
  logout,
  uploadVideo,
  uploadYoutubeVideo,
  getUserVideos,
  getVideoById,
  deleteVideo,
  processVideo,
  generateClips,
  saveCaption,
  getCaptions,
  getVideoAnalytics,
  getFeatureAnalytics,
  getPlatformAnalytics,
  detectSubjectsInVideo,
  analyzeVideoEngagement,
};
