import { Dialog, DialogContent } from "@/components/ui/dialog";
import PostForm from "../form/post-form";
import { TPostSchema } from "@/lib/form-schemas/post-schema";
import { TPostResponse } from "common";
import { useRouter } from "next/navigation";
import { errorToast, regularToast } from "@/lib/utils";
import { editPost } from "@/lib/services/post-service";

type Props = TPostResponse & {
  open: boolean;
  handleDialogOpenChange: (e: boolean) => void;
};

export default function EditPostDialog({
  id,
  title,
  body,
  tags,
  open,
  handleDialogOpenChange,
}: Props) {
  const router = useRouter();

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
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
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
