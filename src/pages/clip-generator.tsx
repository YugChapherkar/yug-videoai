import React, { useState } from "react";
import { Helmet } from "react-helmet";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import ClipGenerator from "@/components/dashboard/ClipGenerator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scissors, History } from "lucide-react";

interface ClipData {
  id: string;
  title: string;
  platform: string;
  duration: number;
  thumbnail: string;
  status: "completed" | "processing" | "failed";
  url: string;
}

const ClipGeneratorPage = () => {
  const [generatedClips, setGeneratedClips] = useState<ClipData[]>([]);

  const handleClipsGenerated = (clips: ClipData[]) => {
    setGeneratedClips((prev) => [...clips, ...prev]);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>AI Clip Generator | VideoAI</title>
      </Helmet>

      <Sidebar activePath="/dashboard/clip-generator" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="AI Clip Generator" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="generator" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                <TabsTrigger
                  value="generator"
                  className="flex items-center gap-2"
                >
                  <Scissors className="h-4 w-4" />
                  Generator
                </TabsTrigger>
                <TabsTrigger
                  value="history"
                  className="flex items-center gap-2"
                >
                  <History className="h-4 w-4" />
                  Generated Clips
                </TabsTrigger>
              </TabsList>

              <TabsContent value="generator">
                <ClipGenerator onClipsGenerated={handleClipsGenerated} />
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Generated Clips History</CardTitle>
                    <CardDescription>
                      View and manage all your AI-generated clips
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generatedClips.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {generatedClips.map((clip) => (
                          <Card key={clip.id} className="overflow-hidden">
                            <div className="relative aspect-video bg-muted">
                              <img
                                src={clip.thumbnail}
                                alt={clip.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-2 right-2">
                                <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                  {clip.platform}
                                </div>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h4 className="font-medium truncate">
                                {clip.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {clip.duration} seconds
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          No clips generated yet. Use the generator to create
                          clips.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClipGeneratorPage;
