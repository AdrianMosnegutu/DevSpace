"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { TPostSchema } from "@/lib/form-schemas/post-schema";
import { errorToast, regularToast } from "@/lib/toasts";
import { serverCreatePost } from "@/lib/services/post-service";
import { useState } from "react";
import { usePosts } from "@/contexts/posts-context";
import { Plus } from "lucide-react";
import { PostForm } from "../forms";

export default function CreatePostDialog() {
  const { createPost } = usePosts();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  async function submitValues(values: TPostSchema) {
    try {
      const newPost = await serverCreatePost(values);
      createPost(newPost);

      regularToast(
        "Post successfully created!",
        "You successfully uploaded your post to DevSpace!",
      );

      setIsDialogOpen(false);
    } catch (error) {
      errorToast("Post could not be created!", error);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="fixed right-6 bottom-6 flex aspect-square h-16 w-16 items-center justify-center rounded-full">
          <Plus strokeWidth={3} className="!h-8 !w-8" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <PostForm
          title="Create Post"
          description="Tell us what's on your mind!"
          actionText="Upload post"
          submitValues={submitValues}
        />
      </DialogContent>
    </Dialog>
  );
}
