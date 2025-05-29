'use client';

import PostForm from "@/components/forms/post-form";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { usePosts } from "@/contexts/posts-context";
import { serverCreatePost } from "@/lib/services/post-service";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function CreatePostButton() {
  const { isAuthenticated } = useAuth();
  const { createPost } = usePosts();
  const [open, setOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (values: any) => {
    const newPost = await serverCreatePost(values);
    createPost(newPost);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <PostForm
          submitValues={handleSubmit}
          title="Create Post"
          description="Share your thoughts with the community"
          actionText="Create Post"
        />
      </DialogContent>
    </Dialog>
  );
} 