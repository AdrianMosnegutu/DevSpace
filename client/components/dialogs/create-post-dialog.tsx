"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PostForm from "../form/post-form";
import { TPostSchema } from "@/lib/form-schemas/post-schema";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constants";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreatePostDialog() {
  const router = useRouter();

  function submitValues(values: TPostSchema) {
    axios
      .post(`${BACKEND_URL}/api/posts`, values)
      .then(() => {
        toast("Post successfully created!", {
          description: "You successfully uploaded your post to DevSpace!",
          descriptionClassName: "!text-neutral-500",
        });
        router.refresh();
      })
      .catch((error: Error) => {
        toast("Post could not be created!", {
          description: error.message,
          descriptionClassName: "!text-red-600",
        });
      });
  }

  return (
    <Dialog>
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
