"use client";

import RemovableTagsList from "@/components/removable-tags-list";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  BACKEND_URL,
  MAX_BODY_LENGTH,
  MAX_TAG_LENGTH,
  MAX_TITLE_LENGTH,
} from "@/lib/constants";
import { postSchema, TPostSchema } from "@/lib/form-schemas/post-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileImage } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import PostInputField from "./post-input-field";
import PostTextareaField from "./post-textarea-field";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CreatePostForm() {
  const router = useRouter();

  const form = useForm<TPostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      body: "",
      tag: "",
      tags: [],
    },
  });

  const { getValues, setValue, control } = form;
  const tags = useWatch({ control, name: "tags" });

  /**
   * Removes a tag from the list of tags assigned to the post.
   *
   * @param tag - The name of the tag that we want to remove.
   */
  function handleRemoveTag(tag: string) {
    setValue(
      "tags",
      getValues("tags").filter((item) => item !== tag),
    );
  }

  /**
   * Adds a tag to the list of tags assigned to the post.
   *
   * @param e - The keyboard event linked to the HTML input element.
   */
  function handleAddTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && getValues("tag").trim()) {
      e.preventDefault();

      if (getValues("tag").trim().length <= MAX_TAG_LENGTH) {
        setValue("tags", [getValues("tag"), ...tags], {
          shouldValidate: true,
        });

        setValue("tag", "");
      }
    }
  }

  /**
   * Creates the post and adds it to the list of total posts.
   *
   * @param values - The properties of the post that we are going to create.
   */
  function createPost(values: TPostSchema) {
    axios
      .post(`${BACKEND_URL}/api/posts`, values)
      .catch((error) => console.error(error));

    toast("Post was created", {
      description: "You successfully uploaded your post to DevSpace!",
      descriptionClassName: "!text-neutral-500",
    });

    router.refresh();
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={form.handleSubmit(createPost)}
      >
        {/* Form header */}
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">Create post</DialogTitle>
          <DialogDescription>
            Tell everybody about what is on your mind!
          </DialogDescription>
        </DialogHeader>

        {/* Input fields */}
        <div className="flex flex-col gap-4">
          {/* Post title */}
          <PostInputField
            control={form.control}
            name="title"
            label="Title"
            placeholder="e.g: C# and it's impact on full-stack development..."
            maxLength={MAX_TITLE_LENGTH}
          />

          {/* Post body */}
          <PostTextareaField
            control={form.control}
            name="body"
            label="Body"
            placeholder="e.g: Today I discovered that..."
            maxLength={MAX_BODY_LENGTH}
          />

          {/* Input for assigning a tag to the post */}
          <PostInputField
            control={form.control}
            name="tag"
            label="Tags"
            placeholder="e.g: ai"
            maxLength={MAX_TAG_LENGTH}
            onKeyDown={handleAddTag}
          />
        </div>

        {/* List of all the tags assigned to the current post */}
        <RemovableTagsList tags={tags} handleRemoveTag={handleRemoveTag} />

        {/* Form buttons */}
        <DialogFooter>
          <Button variant="secondary" type="button">
            <FileImage />
            Add media
          </Button>
          <DialogClose asChild>
            <Button type="submit">Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </form>
    </Form>
  );
}
