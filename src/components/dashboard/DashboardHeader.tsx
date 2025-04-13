import React, { useState } from "react";
import {
  Bell,
  HelpCircle,
  Search,
  Settings,
  User,
  Menu,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// DarkModeToggle removed

interface DashboardHeaderProps {
  username?: string;
  avatarUrl?: string;
  notificationCount?: number;
  onMobileMenuToggle?: () => void;
}

const DashboardHeader = ({
  username = "John Doe",
  avatarUrl = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  notificationCount = 3,
  onMobileMenuToggle,
}: DashboardHeaderProps) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 bg-card border-b border-border w-full">
      <div className="flex items-center">
        {/* Mobile menu toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="mr-2 sm:hidden"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="mr-4 sm:mr-8">
          <h1 className="text-lg sm:text-xl font-bold text-primary">VideoAI</h1>
        </div>

        {/* Desktop search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-64"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>

        {/* Mobile search toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile search input (conditionally rendered) */}
      {showMobileSearch && (
        <div className="absolute top-16 left-0 right-0 bg-card p-3 z-10 border-b border-border md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1.5"
              onClick={() => setShowMobileSearch(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-1 sm:space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </Button>

        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <HelpCircle className="h-5 w-5" />
        </Button>

        {/* Dark mode toggle removed */}

        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Settings className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="p-0">
              <Avatar>
                <AvatarImage src={avatarUrl} alt={username} />
                <AvatarFallback>
                  {username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
