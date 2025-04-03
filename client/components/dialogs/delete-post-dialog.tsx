import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/services/post-service";
import { errorToast, regularToast } from "@/lib/utils";

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
  const router = useRouter();

  async function handleDeletePost() {
    try {
      await deletePost(postId);

      regularToast(
        "Post successfully deleted!",
        "You successfully deleted a post from DevSpace!",
      );

      setTimeout(router.refresh, 100);
    } catch (error) {
      errorToast("Post could not be deleted", error);
    } finally {
      handleDialogOpenChange(false);
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

          <AlertDialogAction onClick={handleDeletePost}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
