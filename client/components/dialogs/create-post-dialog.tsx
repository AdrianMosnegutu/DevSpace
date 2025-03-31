import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CreatePostForm from "../form/create-post-form";

export default function CreatePostDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Post</Button>
      </DialogTrigger>
      <DialogContent>
        <CreatePostForm />
      </DialogContent>
    </Dialog>
  );
}
