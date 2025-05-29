"use client";

import { TPost } from "@/common";
import { useAuth } from "@/contexts/AuthContext";
import { EllipsisVertical, Eraser, Pencil } from "lucide-react";
import { useState } from "react";
import DeletePostDialog from "../dialogs/delete-post-dialog";
import EditPostDialog from "../dialogs/edit-post-dialog";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function PostOptions(post: TPost) {
  const { user } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deletePostOpen, setDeletePostOpen] = useState<boolean>(false);

  console.log('PostOptions - user:', user);
  console.log('PostOptions - post.userId:', post.userId);

  // Only show options if the authenticated user is the author
  if (!user || !user.id) {
    return null;
  }

  console.log('PostOptions - user.id:', user.id);
  console.log('PostOptions - post.userId:', post.userId);

  if (user.id !== post.userId) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Post Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Post
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDeletePostOpen(true)}>
            <Eraser className="mr-2 h-4 w-4" />
            Delete Post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditPostDialog
        {...post}
        open={editDialogOpen}
        handleDialogOpenChange={setEditDialogOpen}
      />

      <DeletePostDialog
        postId={post.id}
        open={deletePostOpen}
        handleDialogOpenChange={setDeletePostOpen}
      />
    </div>
  );
}
