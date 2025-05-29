"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { usePosts } from "@/contexts/posts-context";
import { ArrowUpDown } from "lucide-react";

export default function PostsControls() {
  const { setSearchQuery, setSortOrder } = usePosts();

  return (
    <div className="flex items-center gap-4 mb-8">
      <Input
        type="search"
        placeholder="Search posts..."
        className="max-w-sm"
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setSortOrder("date-desc")}>
            Newest first
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortOrder("date-asc")}>
            Oldest first
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortOrder("likes-desc")}>
            Most liked
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSortOrder("likes-asc")}>
            Least liked
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 