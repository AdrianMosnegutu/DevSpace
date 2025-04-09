import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Control } from "react-hook-form";
import { TPostSchema } from "@/lib/form-schemas/post-schema";
import FieldLabel from "./field-label";

interface Props {
  control: Control<TPostSchema, unknown, TPostSchema>;
  name: "title" | "body" | "tag" | "tags" | `tags.${number}`;
  label?: string;
  placeholder?: string;
  maxLength?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export default function PostInputField({
  control,
  name,
  label,
  placeholder,
  maxLength,
  onKeyDown,
}: Props) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FieldLabel field={field} label={label} maxLength={maxLength} />
          <FormControl>
            <Input placeholder={placeholder} onKeyDown={onKeyDown} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
