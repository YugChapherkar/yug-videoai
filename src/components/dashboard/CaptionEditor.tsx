import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Type,
  Palette,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

interface CaptionEditorProps {
  videoId?: string;
  onSave?: (captionData: CaptionData) => void;
}

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

const fontOptions = [
  { value: "inter", label: "Inter" },
  { value: "roboto", label: "Roboto" },
  { value: "montserrat", label: "Montserrat" },
  { value: "oswald", label: "Oswald" },
  { value: "playfair", label: "Playfair Display" },
  { value: "comic", label: "Comic Sans MS" },
];

const positionOptions = [
  { value: "top", label: "Top" },
  { value: "middle", label: "Middle" },
  { value: "bottom", label: "Bottom" },
];

const CaptionEditor: React.FC<CaptionEditorProps> = ({ videoId, onSave }) => {
  const [captionData, setCaptionData] = useState<CaptionData>({
    text: "Add your caption here",
    font: "inter",
    fontSize: 24,
    color: "#FFFFFF",
    backgroundColor: "#00000080",
    position: "bottom",
    alignment: "center",
    startTime: 0,
    endTime: 5,
    outline: true,
    outlineColor: "#000000",
    shadow: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof CaptionData, value: any) => {
    setCaptionData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!videoId) {
      setError("No video selected for captioning");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      const response = await api.saveCaption(videoId, captionData);

      if (response.success) {
        setSaveSuccess(true);
        if (onSave) {
          onSave(captionData);
        }
      } else {
        throw new Error(response.message || "Failed to save caption");
      }
    } catch (error) {
      console.error("Error saving caption:", error);
      setError(
        typeof error === "object" && error !== null && "message" in error
          ? (error as Error).message
          : "An unknown error occurred",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Load existing caption data if videoId is provided
  useEffect(() => {
    if (!videoId) return;

    const fetchCaptionData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.getCaption(videoId);

        if (response.success && response.caption) {
          setCaptionData(response.caption);
        }
      } catch (error) {
        console.error("Error fetching caption data:", error);
        setError("Failed to load caption data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaptionData();
  }, [videoId]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Caption Editor</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <Type size={16} />
              Text
            </TabsTrigger>
            <TabsTrigger value="style" className="flex items-center gap-2">
              <Palette size={16} />
              Style
            </TabsTrigger>
            <TabsTrigger value="timing" className="flex items-center gap-2">
              <span className="text-sm">⏱️</span>
              Timing
            </TabsTrigger>
          </TabsList>

          {/* Text Tab */}
          <TabsContent value="text" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="caption-text">Caption Text</Label>
              <Textarea
                id="caption-text"
                placeholder="Enter your caption text here"
                value={captionData.text}
                onChange={(e) => handleChange("text", e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="font">Font</Label>
                <Select
                  value={captionData.font}
                  onValueChange={(value) => handleChange("font", value)}
                >
                  <SelectTrigger id="font">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font-size">
                  Font Size: {captionData.fontSize}px
                </Label>
                <Slider
                  id="font-size"
                  min={12}
                  max={72}
                  step={1}
                  value={[captionData.fontSize]}
                  onValueChange={(value) => handleChange("fontSize", value[0])}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text Alignment</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={
                    captionData.alignment === "left" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleChange("alignment", "left")}
                >
                  <AlignLeft size={16} />
                </Button>
                <Button
                  type="button"
                  variant={
                    captionData.alignment === "center" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleChange("alignment", "center")}
                >
                  <AlignCenter size={16} />
                </Button>
                <Button
                  type="button"
                  variant={
                    captionData.alignment === "right" ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleChange("alignment", "right")}
                >
                  <AlignRight size={16} />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Style Tab */}
          <TabsContent value="style" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="text-color">Text Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded border flex-shrink-0"
                    style={{ backgroundColor: captionData.color }}
                  />
                  <Input
                    id="text-color"
                    type="color"
                    value={captionData.color}
                    onChange={(e) => handleChange("color", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bg-color">Background Color</Label>
                <div className="flex gap-2">
                  <div
                    className="w-10 h-10 rounded border flex-shrink-0"
                    style={{ backgroundColor: captionData.backgroundColor }}
                  />
                  <Input
                    id="bg-color"
                    type="color"
                    value={captionData.backgroundColor.slice(0, 7)}
                    onChange={(e) =>
                      handleChange("backgroundColor", e.target.value + "80")
                    }
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Select
                value={captionData.position}
                onValueChange={(value) => handleChange("position", value)}
              >
                <SelectTrigger id="position">
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positionOptions.map((pos) => (
                    <SelectItem key={pos.value} value={pos.value}>
                      {pos.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="outline">Text Outline</Label>
                  <p className="text-sm text-muted-foreground">
                    Add outline to make text more readable
                  </p>
                </div>
                <Switch
                  id="outline"
                  checked={captionData.outline}
                  onCheckedChange={(checked) =>
                    handleChange("outline", checked)
                  }
                />
              </div>

              {captionData.outline && (
                <div className="space-y-2">
                  <Label htmlFor="outline-color">Outline Color</Label>
                  <div className="flex gap-2">
                    <div
                      className="w-10 h-10 rounded border flex-shrink-0"
                      style={{ backgroundColor: captionData.outlineColor }}
                    />
                    <Input
                      id="outline-color"
                      type="color"
                      value={captionData.outlineColor}
                      onChange={(e) =>
                        handleChange("outlineColor", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="shadow">Text Shadow</Label>
                  <p className="text-sm text-muted-foreground">
                    Add shadow effect to text
                  </p>
                </div>
                <Switch
                  id="shadow"
                  checked={captionData.shadow}
                  onCheckedChange={(checked) => handleChange("shadow", checked)}
                />
              </div>
            </div>
          </TabsContent>

          {/* Timing Tab */}
          <TabsContent value="timing" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="start-time">
                Start Time (seconds): {captionData.startTime}s
              </Label>
              <Slider
                id="start-time"
                min={0}
                max={60}
                step={0.1}
                value={[captionData.startTime]}
                onValueChange={(value) => handleChange("startTime", value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-time">
                End Time (seconds): {captionData.endTime}s
              </Label>
              <Slider
                id="end-time"
                min={captionData.startTime + 0.5}
                max={60}
                step={0.1}
                value={[captionData.endTime]}
                onValueChange={(value) => handleChange("endTime", value[0])}
              />
            </div>

            <div className="p-4 bg-muted rounded-md">
              <p className="text-sm">
                Duration:{" "}
                {(captionData.endTime - captionData.startTime).toFixed(1)}{" "}
                seconds
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 border rounded-md bg-muted/50">
          <p className="text-sm font-medium mb-2">Preview:</p>
          <div className="relative w-full h-16 bg-gray-800 rounded-md flex items-center justify-center overflow-hidden">
            <div
              className={`px-4 py-2 rounded ${captionData.position === "top" ? "absolute top-0" : captionData.position === "middle" ? "" : "absolute bottom-0"} ${captionData.alignment === "left" ? "text-left" : captionData.alignment === "right" ? "text-right" : "text-center"}`}
              style={{
                fontFamily: captionData.font,
                fontSize: `${captionData.fontSize / 2}px`, // Scaled down for preview
                color: captionData.color,
                backgroundColor: captionData.backgroundColor,
                textShadow: captionData.shadow
                  ? "2px 2px 4px rgba(0,0,0,0.5)"
                  : "none",
                WebkitTextStroke: captionData.outline
                  ? `1px ${captionData.outlineColor}`
                  : "none",
                maxWidth: "90%",
                width: "100%",
              }}
            >
              {captionData.text}
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {saveSuccess && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Caption saved successfully
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          {isLoading && (
            <p className="text-sm text-muted-foreground">
              Loading caption data...
            </p>
          )}
          <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Apply Caption"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaptionEditor;
