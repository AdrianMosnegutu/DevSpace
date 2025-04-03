import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PostForm from "../form/post-form";
import { Pencil } from "lucide-react";
import { TPostSchema } from "@/lib/form-schemas/post-schema";
import axios from "axios";
import { BACKEND_URL } from "@/lib/constants";
import { toast } from "sonner";
import { TPostResponse } from "common";
import { useRouter } from "next/navigation";

export default function EditPostDialog({
  id,
  title,
  body,
  tags,
  closeDropdown,
}: TPostResponse & { closeDropdown: () => void }) {
  const router = useRouter();

  function submitValues(values: TPostSchema) {
    axios
      .patch(`${BACKEND_URL}/api/posts/${id}`, values)
      .then(() => {
        toast("Post successfully edited!", {
          description: "You successfully edited a post!",
          descriptionClassName: "!text-neutral-500",
        });
        router.refresh();
      })
      .catch((error: Error) => {
        toast("Post could not be edited!", {
          description: error.message,
          descriptionClassName: "!text-red-600",
        });
      });
  }

  return (
    <Dialog onOpenChange={(e) => !e.valueOf() && closeDropdown()}>
      <DialogTrigger className="flex h-full w-full items-center gap-2 px-2 py-1.5">
        <Pencil />
        Edit
      </DialogTrigger>

      <DialogContent>
        <PostForm
          title="Edit Post"
          description="Make a revision to your post!"
          actionText="Save changes"
          defaultTitle={title}
          defaultBody={body}
          defaultTags={tags}
          submitValues={submitValues}
        />
      </DialogContent>
    </Dialog>
  );
}
