import { TPostSchema } from "@/lib/form-schemas/post-schema";
import { Control } from "react-hook-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import FieldLabel from "./field-label";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<TPostSchema, any, TPostSchema>;
  name: "title" | "body" | "tag" | "tags" | `tags.${number}`;
  label?: string;
  placeholder?: string;
  maxLength?: number;
}

export default function PostTextareaField({
  control,
  name,
  label,
  placeholder,
  maxLength,
}: Props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FieldLabel field={field} label={label} maxLength={maxLength} />
          <FormControl>
            <Textarea
              className="max-h-96"
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
