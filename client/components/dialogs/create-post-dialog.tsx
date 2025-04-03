"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PostForm from "../form/post-form";
import { TPostSchema } from "@/lib/form-schemas/post-schema";
import { useRouter } from "next/navigation";
import { errorToast, regularToast } from "@/lib/utils";
import { createPost } from "@/lib/services/post-service";
import { useState } from "react";

export default function CreatePostDialog() {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  async function submitValues(values: TPostSchema) {
    try {
      await createPost(values);

      regularToast(
        "Post successfully edited!",
        "You successfully uploaded yor post to DevSpace!",
      );

      setTimeout(router.refresh, 100);
    } catch (error) {
      errorToast("Post could not be created!", error);
    } finally {
      setIsDialogOpen(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Create Post</Button>
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
