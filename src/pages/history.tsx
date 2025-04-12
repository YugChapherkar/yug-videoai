import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, Filter } from "lucide-react";
import VideoHistory from "@/components/dashboard/VideoHistory";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Sidebar from "@/components/dashboard/Sidebar";

const HistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [platform, setPlatform] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a filtered search
    setRefreshTrigger((prev) => prev + 1);
  };

  const handlePlay = (id: string) => {
    console.log(`Playing video ${id}`);
    // In a real app, this would open a video player
    alert(`Playing video ${id}`);
  };

  const handleDownload = (id: string) => {
    console.log(`Downloading video ${id}`);
    // In a real app, this would trigger a download
    alert(`Download started for video ${id}`);
  };

  const handleShare = (id: string) => {
    console.log(`Sharing video ${id}`);
    // In a real app, this would open a share dialog
    alert(`Share dialog opened for video ${id}`);
  };

  const handleDelete = (id: string) => {
    console.log(`Deleted video ${id}`);
    // The actual deletion is handled in the VideoHistory component
  };

  const handleEdit = (id: string) => {
    console.log(`Editing video ${id}`);
    // In a real app, this would open an edit dialog
    alert(`Edit dialog opened for video ${id}`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Helmet>
        <title>Video History | VideoAI</title>
      </Helmet>

      <Sidebar activePath="/dashboard/history" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader title="Video History" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Search and filter section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <Input
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="w-[180px]">
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Platforms</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-[180px]">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button type="submit" className="gap-2">
                  <Search size={16} />
                  Search
                </Button>

                <Button type="button" variant="outline" className="gap-2">
                  <Filter size={16} />
                  Clear Filters
                </Button>
              </form>
            </div>

            {/* Video history list */}
            <VideoHistory
              onPlay={handlePlay}
              onDownload={handleDownload}
              onShare={handleShare}
              onDelete={handleDelete}
              onEdit={handleEdit}
              refreshTrigger={refreshTrigger}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HistoryPage;
