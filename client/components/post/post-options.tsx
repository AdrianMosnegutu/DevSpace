"use client";

import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";
import DeletePostDialog from "../dialogs/delete-post-dialog";
import EditPostDialog from "../dialogs/edit-post-dialog";
import { TPostResponse } from "common";

export default function PostOptions(post: TPostResponse) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      {/* The post options button */}
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Post Actions</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Edit post button */}
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          className="p-0"
        >
          <EditPostDialog
            {...post}
            closeDropdown={() => setDropdownOpen(false)}
          />
        </DropdownMenuItem>

        {/* Delete post button */}
        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          className="p-0"
        >
          <DeletePostDialog
            postId={post.id}
            closeDropdown={() => setDropdownOpen(false)}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
