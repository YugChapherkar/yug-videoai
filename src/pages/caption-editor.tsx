import React from "react";
import { Helmet } from "react-helmet";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";
import CaptionEditor from "@/components/dashboard/CaptionEditor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Type, Video } from "lucide-react";

interface CaptionData {
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

const CaptionEditorPage = () => {
  const handleSaveCaptions = (captionData: CaptionData) => {
    console.log("Caption data saved:", captionData);
    // In a real app, this would save to backend
    alert("Captions applied successfully!");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Helmet>
        <title>Caption Editor | VideoAI</title>
      </Helmet>

      <Sidebar activePath="/dashboard/caption-editor" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Caption Editor" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
                <TabsTrigger value="editor" className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  Caption Editor
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2"
                >
                  <Video className="h-4 w-4" />
                  Video Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <CaptionEditor onSave={handleSaveCaptions} />
                  </div>
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Caption Tips</CardTitle>
                        <CardDescription>
                          Best practices for effective captions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="font-medium">Keep it concise</h4>
                          <p className="text-sm text-muted-foreground">
                            Short captions are easier to read and more likely to
                            be viewed completely.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Use contrasting colors
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Ensure text is readable by using colors that stand
                            out from the background.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Add outlines for clarity
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Text outlines help captions remain readable against
                            changing backgrounds.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Time captions appropriately
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Sync captions with speech and give viewers enough
                            time to read.
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium">
                            Platform-specific considerations
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            TikTok and Instagram Reels often perform better with
                            larger, bolder captions.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Preview with Captions</CardTitle>
                    <CardDescription>
                      See how your captions will appear in the final video
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-800 rounded-md flex items-center justify-center">
                      <p className="text-white">
                        Video preview will appear here
                      </p>
                    </div>
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

export default CaptionEditorPage;
