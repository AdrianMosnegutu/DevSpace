import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import PostForm from "../form/post-form";
import { Pencil } from "lucide-react";
import { TPostSchema } from "@/lib/form-schemas/post-schema";
import { TPostResponse } from "common";
import { useRouter } from "next/navigation";
import { errorToast, regularToast } from "@/lib/utils";
import { editPost } from "@/lib/services/post-service";
import { useState } from "react";

export default function EditPostDialog({
  id,
  title,
  body,
  tags,
  closeDropdown,
}: TPostResponse & { closeDropdown: () => void }) {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function handleDialogOpenChange(e: boolean) {
    setIsDialogOpen(e);
    if (!e) {
      closeDropdown();
    }
  }

  async function submitValues(values: TPostSchema) {
    try {
      await editPost(id, values);

      regularToast(
        "Post successfully edited!",
        "You successfully edited a post!",
      );

      setTimeout(router.refresh, 100);
    } catch (error) {
      errorToast("Post could not be edited!", error);
    } finally {
      handleDialogOpenChange(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
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
