"use client";

import { EllipsisVertical, Eraser, Pencil } from "lucide-react";
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
import { TPost } from "common";

export default function PostOptions(post: TPost) {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [deletePostOpen, setDeletePostOpen] = useState<boolean>(false);

  return (
    <>
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
            onSelect={(event) => {
              event.preventDefault();
              setEditDialogOpen(true);
            }}
          >
            <Pencil />
            Edit
          </DropdownMenuItem>

          {/* Delete post button */}
          <DropdownMenuItem
            onSelect={(event) => {
              event.preventDefault();
              setDeletePostOpen(true);
            }}
            className="!text-red-600"
          >
            <Eraser className="text-red-600" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit post dialog */}
      <EditPostDialog
        {...post}
        open={editDialogOpen}
        handleDialogOpenChange={(e) => {
          setEditDialogOpen(e);
          if (!e) {
            setDropdownOpen(false);
          }
        }}
      />

      {/* Delete post dialog */}
      <DeletePostDialog
        postId={post.id}
        open={deletePostOpen}
        handleDialogOpenChange={(e) => {
          setDeletePostOpen(e);
          if (!e) {
            setDropdownOpen(false);
          }
        }}
      />
    </>
  );
}
