import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Youtube, Scissors, Type, ArrowRight } from "lucide-react";

interface QuickStartGuideProps {
  onClose?: () => void;
}

const QuickStartGuide = ({ onClose }: QuickStartGuideProps) => {
  const steps = [
    {
      icon: <Upload className="h-8 w-8 text-primary" />,
      title: "Upload Your Video",
      description:
        "Drag & drop your video file or paste a YouTube link to get started.",
    },
    {
      icon: <Scissors className="h-8 w-8 text-primary" />,
      title: "Edit & Customize",
      description:
        "Crop, rotate, and trim your video to fit different social media platforms.",
    },
    {
      icon: <Type className="h-8 w-8 text-primary" />,
      title: "Add Captions",
      description:
        "Make your content accessible with customizable captions and text overlays.",
    },
    {
      icon: <Youtube className="h-8 w-8 text-red-500" />,
      title: "Export & Share",
      description:
        "Download your optimized video or share directly to social media platforms.",
    },
  ];

  return (
    <Card className="w-full shadow-lg border-primary/20">
      <CardHeader className="bg-muted/50">
        <CardTitle className="text-xl">Quick Start Guide</CardTitle>
        <CardDescription>
          Follow these simple steps to create your first video
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="mb-3 bg-background rounded-full p-3 shadow-sm">
                  {step.icon}
                </div>
                <h3 className="font-medium text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground mt-2 hidden md:block rotate-90 md:rotate-0" />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>Got it</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStartGuide;
