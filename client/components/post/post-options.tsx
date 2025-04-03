"use client";

import { EllipsisVertical, Pencil } from "lucide-react";
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

interface Props {
  postId: string;
}

export default function PostOptions({ postId }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <DropdownMenuLabel>Post Actions</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <Pencil />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(event) => event.preventDefault()}
          className="p-0"
        >
          <DeletePostDialog
            postId={postId}
            closeDropdown={() => setDropdownOpen(false)}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
