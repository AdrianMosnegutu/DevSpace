import { z } from "zod";
import {
  MAX_BODY_LENGTH,
  MAX_TAG_LENGTH,
  MAX_TITLE_LENGTH,
} from "../constants";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required!")
    .max(MAX_TITLE_LENGTH, "Title is too long!")
    .trim(),

  body: z
    .string()
    .min(1, "Body is required!")
    .max(MAX_BODY_LENGTH, "Body is too long!")
    .trim(),

  tag: z.string().max(MAX_TAG_LENGTH, "Tag is too long!").trim(),

  tags: z.string().array(),
});

export type TPostSchema = z.infer<typeof postSchema>;
