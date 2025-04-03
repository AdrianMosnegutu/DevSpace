import PostForm from "../form/post-form";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { TPostSchema } from "@/lib/form-schemas/post-schema";
import { TPost } from "common";
import { errorToast, regularToast } from "@/lib/utils";
import { serverUpdatePost } from "@/lib/services/post-service";
import { usePosts } from "@/contexts/posts-context";

type Props = TPost & {
  open: boolean;
  handleDialogOpenChange: (isOpen: boolean) => void;
};

export default function EditPostDialog({
  id,
  title,
  body,
  tags,
  open,
  handleDialogOpenChange,
}: Props) {
  const { updatePost } = usePosts();

  async function submitValues(values: TPostSchema) {
    try {
      const updatedPost = await serverUpdatePost(id, values);
      updatePost(updatedPost);

      regularToast(
        "Post successfully updated!",
        "You successfully edited a post!",
      );

      handleDialogOpenChange(false);
    } catch (error) {
      errorToast("Post could not be edited!", error);
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
