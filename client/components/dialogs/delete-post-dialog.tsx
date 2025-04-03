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
import { toast } from "sonner";

interface Props {
  postId: string;
  closeDropdown: () => void;
}

export default function DeletePostDialog({ postId, closeDropdown }: Props) {
  const router = useRouter();

  function handleDeletePost() {
    deletePost(postId)
      .then(() => {
        toast("Post was deleted", {
          description: "You successfully deleted this post!",
          descriptionClassName: "!text-neutral-500",
        });
      })
      .catch((err: Error) => {
        toast("Post could not be deleted", {
          description: `This post couldn't be deleted: ${err.message}`,
          descriptionClassName: "!text-neutral-500",
        });
      });

    closeDropdown();
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex h-full w-full items-center gap-2 px-2 py-1.5">
        <Eraser />
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
