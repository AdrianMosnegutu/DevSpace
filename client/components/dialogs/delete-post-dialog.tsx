import { Eraser } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/services/post-service";
import { errorToast, regularToast } from "@/lib/utils";
import { useState } from "react";

interface Props {
  postId: string;
  closeDropdown: () => void;
}

export default function DeletePostDialog({ postId, closeDropdown }: Props) {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  function handleDialogOpenChange(e: boolean) {
    setIsDialogOpen(e);
    if (!e) {
      closeDropdown();
    }
  }

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
      closeDropdown();
    }
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <AlertDialogTrigger className="flex h-full w-full items-center gap-2 px-2 py-1.5 text-red-600">
        <Eraser className="text-red-600" />
        Delete
      </AlertDialogTrigger>

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
          <AlertDialogCancel onClick={closeDropdown}>Cancel</AlertDialogCancel>

          <AlertDialogAction onClick={handleDeletePost}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
