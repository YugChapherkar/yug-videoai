import DarkModeToggle from "@/components/dashboard/DarkModeToggle";
import { ThemeProvider } from "@/components/ThemeProvider";

export default function DarkModeToggleStoryboard() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="videoai-theme-storyboard">
      <div className="bg-background text-foreground p-6 flex items-center justify-center min-h-[200px]">
        <DarkModeToggle />
      </div>
    </ThemeProvider>
  );
}
