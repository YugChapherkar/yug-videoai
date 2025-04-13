import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Hash, RefreshCw, Sparkles } from "lucide-react";

interface TrendingHashtagSuggestionsProps {
  videoContent?: string; // Description or transcript of the video
  platform?: string; // The platform (youtube, instagram, tiktok)
  onHashtagSelect?: (hashtag: string) => void;
  className?: string;
}

const TrendingHashtagSuggestions: React.FC<TrendingHashtagSuggestionsProps> = ({
  videoContent = "",
  platform = "all",
  onHashtagSelect = () => {},
  className = "",
}) => {
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);

  // Mock trending hashtags by platform
  const mockTrendingHashtags = {
    all: [
      "trending",
      "viral",
      "fyp",
      "foryou",
      "trending2024",
      "viralvideo",
      "explore",
      "content",
      "creator",
    ],
    youtube: [
      "shorts",
      "youtubeshorts",
      "subscribe",
      "youtuber",
      "trending",
      "viral",
      "youtube",
      "ytcreator",
    ],
    instagram: [
      "reels",
      "instareels",
      "instagram",
      "instadaily",
      "instagood",
      "explore",
      "trending",
      "viral",
    ],
    tiktok: [
      "fyp",
      "foryou",
      "foryoupage",
      "tiktokviral",
      "tiktok",
      "viral",
      "trending",
      "tiktoker",
    ],
  };

  // Content-based hashtags (would be AI-generated in a real implementation)
  const mockContentBasedHashtags = {
    tech: ["tech", "technology", "gadgets", "innovation", "ai", "future"],
    food: ["food", "cooking", "recipe", "delicious", "foodie", "yummy"],
    travel: ["travel", "adventure", "wanderlust", "explore", "vacation"],
    fitness: ["fitness", "workout", "gym", "health", "exercise", "motivation"],
    beauty: ["beauty", "makeup", "skincare", "glam", "tutorial"],
    gaming: ["gaming", "gamer", "videogames", "gameplay", "streamer"],
  };

  // Simulate AI analysis of video content to generate relevant hashtags
  const analyzeVideoContent = (content: string) => {
    // In a real implementation, this would use AI to analyze the video content
    // For now, we'll just check for keywords in the mock content
    const contentLower = content.toLowerCase();
    let contentTags: string[] = [];

    Object.entries(mockContentBasedHashtags).forEach(([category, tags]) => {
      if (contentLower.includes(category)) {
        contentTags = [...contentTags, ...tags];
      }
    });

    // If no specific content is detected, return a mix of general tags
    if (contentTags.length === 0) {
      contentTags = [
        "content",
        "creator",
        "video",
        "share",
        "follow",
        "like",
        "comment",
      ];
    }

    return contentTags;
  };

  const generateHashtags = () => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // Get platform-specific trending hashtags
      const trendingTags =
        platform === "all"
          ? mockTrendingHashtags.all
          : [
              ...mockTrendingHashtags[
                platform as keyof typeof mockTrendingHashtags
              ],
              ...mockTrendingHashtags.all.slice(0, 3),
            ];

      // Get content-based hashtags
      const contentTags = analyzeVideoContent(videoContent);

      // Combine and shuffle tags for variety
      const combinedTags = [...trendingTags, ...contentTags];
      const shuffledTags = combinedTags
        .sort(() => 0.5 - Math.random())
        .slice(0, 12); // Limit to 12 hashtags

      setHashtags(shuffledTags);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    generateHashtags();
  }, [platform, videoContent]);

  const handleHashtagClick = (hashtag: string) => {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(selectedHashtags.filter((tag) => tag !== hashtag));
    } else {
      setSelectedHashtags([...selectedHashtags, hashtag]);
    }
    onHashtagSelect(hashtag);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Hash className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-medium">Trending Hashtags</h3>
          {platform !== "all" && (
            <Badge variant="outline" className="text-xs">
              {platform}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={generateHashtags}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          <span className="sr-only">Refresh hashtags</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {hashtags.map((hashtag) => {
            const isSelected = selectedHashtags.includes(hashtag);
            return (
              <Badge
                key={hashtag}
                variant={isSelected ? "default" : "outline"}
                className={`cursor-pointer ${isSelected ? "bg-primary" : "hover:bg-primary/10"}`}
                onClick={() => handleHashtagClick(hashtag)}
              >
                #{hashtag}
                {isSelected && (
                  <Sparkles className="ml-1 h-3 w-3 text-primary-foreground" />
                )}
              </Badge>
            );
          })}
        </div>
      )}

      {selectedHashtags.length > 0 && (
        <div className="pt-2">
          <p className="text-xs text-muted-foreground">
            Selected: {selectedHashtags.map((tag) => `#${tag}`).join(" ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default TrendingHashtagSuggestions;
