import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { serverDeletePost } from "@/lib/services/post-service";
import { errorToast, regularToast } from "@/lib/toasts";
import { usePosts } from "@/contexts/posts-context";
import { Button } from "../ui/button";

interface Props {
  postId: string;
  open: boolean;
  handleDialogOpenChange: (e: boolean) => void;
}

export default function DeletePostDialog({
  postId,
  open,
  handleDialogOpenChange,
}: Props) {
  const { deletePost } = usePosts();

  async function handleDeletePost() {
    try {
      await serverDeletePost(postId);

      regularToast(
        "Post successfully deleted!",
        "You successfully deleted a post from DevSpace!",
      );

      handleDialogOpenChange(false);
      setTimeout(() => deletePost(postId), 200);
    } catch (error) {
      errorToast("Post could not be deleted", error);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleDialogOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this post?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this post
            and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleDialogOpenChange(false)}>
            Cancel
          </AlertDialogCancel>

          <Button onClick={handleDeletePost}>Delete</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
