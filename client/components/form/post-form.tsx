import RemovableTagsList from "@/components/removable-tags-list";
import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
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

interface Props {
  submitValues: (values: TPostSchema) => void;
  title: string;
  description?: string;
  actionText: string;
  defaultTitle?: string;
  defaultBody?: string;
  defaultTags?: string[];
}

export default function PostForm({
  submitValues,
  title,
  description,
  actionText,
  defaultTitle,
  defaultBody,
  defaultTags,
}: Props) {
  const form = useForm<TPostSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: defaultTitle || "",
      body: defaultBody || "",
      tag: "",
      tags: defaultTags || [],
    },
  });

  const { handleSubmit, getValues, setValue, control } = form;
  const tags = useWatch({ control, name: "tags" });

  function handleRemoveTag(tag: string) {
    setValue(
      "tags",
      getValues("tags").filter((item) => item !== tag),
    );
  }

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

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-8"
        onSubmit={handleSubmit(submitValues)}
      >
        {/* Form header */}
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
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
          {/* Add media (videos or photos) */}
          <Button variant="secondary" type="button">
            <FileImage />
            Add media
          </Button>

          {/* Save form changes */}
          <Button type="submit">{actionText}</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
